package xyz.cursedman.psk.ecommerce.ordering.api;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import xyz.cursedman.psk.ecommerce.TestcontainersConfiguration;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductRepository;
import xyz.cursedman.psk.ecommerce.ordering.domain.OrderRepository;
import xyz.cursedman.psk.ecommerce.ordering.domain.OrderStatus;

import static org.assertj.core.api.Assertions.assertThat;
import static xyz.cursedman.psk.ecommerce.OrderRequests.NO_INVOICE;
import static xyz.cursedman.psk.ecommerce.OrderRequests.orderJson;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@AutoConfigureMockMvc
@Transactional
class OrderApiTests {

	static final String CUSTOMER_ID = "0b6f7c1e-customer";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private OrderRepository orderRepository;

	ResultActions placeOrder(String json) throws Exception {
		return mockMvc.perform(post("/api/orders")
			.with(jwt().jwt(token -> token.subject(CUSTOMER_ID)).authorities(new SimpleGrantedAuthority("ROLE_user")))
			.contentType(MediaType.APPLICATION_JSON)
			.content(json));
	}

	@Test
	void placesPaidOrderPricedFromCatalog() throws Exception {
		int stockBefore = productRepository.findById(1L).orElseThrow().getStock();

		placeOrder(orderJson("""
				[{"id": 1, "name": "Sony WH-1000XM5", "price": 1, "image": null, "quantity": 1},
				 {"id": 8, "quantity": 2}, {"id": 1, "quantity": 1}]"""))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.status").value("PAID"))
			// 2 × 1299.00 + 2 × 149.00 + 14.99 courier
			.andExpect(jsonPath("$.total").value(2910.99))
			.andExpect(jsonPath("$.currency").value("PLN"))
			.andExpect(jsonPath("$.clientSecret").doesNotExist());

		assertThat(productRepository.findById(1L).orElseThrow().getStock()).isEqualTo(stockBefore - 2);
		assertThat(orderRepository.findAll()).singleElement().satisfies(order -> {
			assertThat(order.getCustomerId()).isEqualTo(CUSTOMER_ID);
			assertThat(order.getStatus()).isEqualTo(OrderStatus.PAID);
			assertThat(order.getVatAmount()).isEqualByComparingTo("544.33");
			assertThat(order.getItems()).hasSize(2);
		});
	}

	@Test
	void storesSeparateInvoiceDetails() throws Exception {
		placeOrder(orderJson("[{\"id\": 3, \"quantity\": 1}]", "pickup", false, """
				{"name": "ACME sp. z o.o.", "taxId": "123-456-78-90",
				 "address": {"street": "Krótka", "houseNumber": "2", "postalCode": "30-001", "city": "Kraków", "country": "Polska"}}"""))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.total").value(599.00));

		assertThat(orderRepository.findAll()).singleElement().satisfies(order -> {
			assertThat(order.getInvoice().getName()).isEqualTo("ACME sp. z o.o.");
			assertThat(order.getInvoice().getAddress().getCity()).isEqualTo("Kraków");
			assertThat(order.getDeliveryAddress().getCity()).isEqualTo("Warszawa");
		});
	}

	@Test
	void rejectsOrderExceedingStock() throws Exception {
		placeOrder(orderJson("[{\"id\": 9, \"quantity\": 4}]"))
			.andExpect(status().isConflict())
			.andExpect(jsonPath("$.detail").value(
				"Insufficient stock for product 9 (Anker PowerCore 20000): requested 4, available 3"));
	}

	@Test
	void rejectsUnknownProduct() throws Exception {
		placeOrder(orderJson("[{\"id\": 999, \"quantity\": 1}]"))
			.andExpect(status().isNotFound());
	}

	@Test
	void rejectsUnknownDeliveryMethod() throws Exception {
		placeOrder(orderJson("[{\"id\": 1, \"quantity\": 1}]", "drone", true, NO_INVOICE))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.detail").value("Unknown delivery method drone"));
	}

	@Test
	void rejectsInvalidRequest() throws Exception {
		placeOrder(orderJson("[]"))
			.andExpect(status().isBadRequest());
		placeOrder(orderJson("[{\"id\": 1, \"quantity\": 0}]"))
			.andExpect(status().isBadRequest());
		placeOrder(orderJson("[{\"id\": 1, \"quantity\": 1}]").replace("+48 600 100 200", "123"))
			.andExpect(status().isBadRequest());
		placeOrder(orderJson("[{\"id\": 1, \"quantity\": 1}]").replace("\"blik\"", "\"cash\""))
			.andExpect(status().isBadRequest());
		placeOrder(orderJson("[{\"id\": 1, \"quantity\": 1}]", "courier", false, NO_INVOICE))
			.andExpect(status().isBadRequest());
	}

	@Test
	void ignoresInvoiceWhenSameAsDelivery() throws Exception {
		placeOrder(orderJson("[{\"id\": 1, \"quantity\": 1}]"))
			.andExpect(status().isCreated());

		assertThat(orderRepository.findAll()).singleElement()
			.satisfies(order -> assertThat(order.getInvoice()).isNull());
	}

	@Test
	void listsCheckoutOptions() throws Exception {
		mockMvc.perform(get("/api/checkout/options"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.deliveryMethods[0].id").value("courier"))
			.andExpect(jsonPath("$.deliveryMethods[0].price").value(14.99))
			.andExpect(jsonPath("$.paymentMethods[0].id").value("blik"))
			.andExpect(jsonPath("$.paymentMethods[1].name").value("Karta płatnicza"))
			.andExpect(jsonPath("$.vatRate").value(0.23));
	}

}
