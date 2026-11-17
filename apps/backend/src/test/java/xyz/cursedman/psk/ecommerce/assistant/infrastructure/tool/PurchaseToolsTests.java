package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool;

import org.junit.jupiter.api.Test;

import org.springframework.ai.chat.model.ToolContext;
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
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.AssistantToolContext;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.RecentPurchasesDto;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@AutoConfigureMockMvc
@Transactional
class PurchaseToolsTests {

	@Autowired
	private PurchaseTools purchaseTools;

	@Autowired
	private MockMvc mockMvc;

	@Test
	void guestHasNoPurchases() {
		RecentPurchasesDto purchases = purchaseTools.getRecentPurchases(toolContextFor(null));

		assertThat(purchases.customerSignedIn()).isFalse();
		assertThat(purchases.purchases()).isEmpty();
	}

	@Test
	void customerSeesOnlyTheirOwnPurchases() throws Exception {
		buy("alice", 1);
		buy("bob", 2);

		RecentPurchasesDto purchases = purchaseTools.getRecentPurchases(toolContextFor("alice"));

		assertThat(purchases.customerSignedIn()).isTrue();
		assertThat(purchases.purchases()).singleElement().satisfies(purchase -> {
			assertThat(purchase.productId()).isEqualTo(1L);
			assertThat(purchase.productName()).isEqualTo("Sony WH-1000XM5");
			assertThat(purchase.quantity()).isEqualTo(1);
			assertThat(purchase.orderedAt()).isNotNull();
		});
	}

	private static ToolContext toolContextFor(String customerId) {
		return new ToolContext(new AssistantToolContext(customerId, products -> {
		}).toMap());
	}

	private void buy(String customerId, long productId) throws Exception {
		mockMvc.perform(post("/api/orders")
				.with(jwt().jwt(token -> token.subject(customerId)).authorities(new SimpleGrantedAuthority("ROLE_user")))
				.contentType(MediaType.APPLICATION_JSON)
				.content(OrderRequests.orderJson("[{\"id\": %d, \"quantity\": 1}]".formatted(productId))))
			.andExpect(status().isCreated());
	}

}
