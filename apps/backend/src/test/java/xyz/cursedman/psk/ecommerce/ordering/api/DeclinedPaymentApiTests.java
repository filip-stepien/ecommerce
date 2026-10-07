package xyz.cursedman.psk.ecommerce.ordering.api;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import xyz.cursedman.psk.ecommerce.OrderRequests;
import xyz.cursedman.psk.ecommerce.TestcontainersConfiguration;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "shop.payments.fake.decline=true")
@Import(TestcontainersConfiguration.class)
@AutoConfigureMockMvc
@Transactional
class DeclinedPaymentApiTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ProductRepository productRepository;

	@Test
	void keepsFailedOrderAndReleasesStock() throws Exception {
		int stockBefore = productRepository.findById(1L).orElseThrow().getStock();

		mockMvc.perform(post("/api/orders")
				.with(jwt().authorities(new SimpleGrantedAuthority("ROLE_user")))
				.contentType(MediaType.APPLICATION_JSON)
				.content(OrderRequests.orderJson("[{\"id\": 1, \"quantity\": 2}]")))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.status").value("PAYMENT_FAILED"));

		assertThat(productRepository.findById(1L).orElseThrow().getStock()).isEqualTo(stockBefore);
	}

}
