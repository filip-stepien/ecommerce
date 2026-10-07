package xyz.cursedman.psk.ecommerce.recommendation.api;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.transaction.annotation.Transactional;

import xyz.cursedman.psk.ecommerce.OrderRequests;
import xyz.cursedman.psk.ecommerce.TestcontainersConfiguration;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@AutoConfigureMockMvc
@Transactional
class RecommendationApiTests {

	@Autowired
	private MockMvc mockMvc;

	static RequestPostProcessor customer(String id) {
		return jwt().jwt(token -> token.subject(id)).authorities(new SimpleGrantedAuthority("ROLE_user"));
	}

	void buy(String customerId, long productId, int quantity) throws Exception {
		mockMvc.perform(post("/api/orders").with(customer(customerId))
				.contentType(MediaType.APPLICATION_JSON)
				.content(OrderRequests.orderJson("[{\"id\": %d, \"quantity\": %d}]".formatted(productId, quantity))))
			.andExpect(status().isCreated());
	}

	@Test
	void guestWithoutSalesGetsNewestProducts() throws Exception {
		mockMvc.perform(get("/api/products/recommended").param("limit", "3"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$[*].id", contains(14, 13, 12)));
	}

	@Test
	void customerGetsProductsMatchingPurchasesFirst() throws Exception {
		buy("alice", 1, 1); // Sony WH-1000XM5, Audio

		mockMvc.perform(get("/api/products/recommended").param("limit", "4").with(customer("alice")))
			.andExpect(status().isOk())
			// in-stock Audio products not bought yet, then the best-seller is skipped (bought) and the newest follows
			.andExpect(jsonPath("$[0:3].id", containsInAnyOrder(2, 3, 5)))
			.andExpect(jsonPath("$[3].id").value(14))
			.andExpect(jsonPath("$[*].id", not(hasItem(1))));
	}

	@Test
	void guestGetsBestsellersFirst() throws Exception {
		buy("alice", 6, 1);
		buy("bob", 8, 3);

		mockMvc.perform(get("/api/products/recommended").param("limit", "3"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$[*].id", contains(8, 6, 14)));
	}

	@Test
	void rejectsInvalidLimit() throws Exception {
		mockMvc.perform(get("/api/products/recommended").param("limit", "0"))
			.andExpect(status().isBadRequest());
		mockMvc.perform(get("/api/products/1/related").param("limit", "25"))
			.andExpect(status().isBadRequest());
	}

}
