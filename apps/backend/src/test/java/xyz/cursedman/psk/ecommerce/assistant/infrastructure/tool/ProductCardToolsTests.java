package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

import org.springframework.ai.chat.model.ToolContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import xyz.cursedman.psk.ecommerce.TestcontainersConfiguration;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.AssistantToolContext;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.ShownProductsDto;
import xyz.cursedman.psk.ecommerce.catalog.domain.Product;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
class ProductCardToolsTests {

	@Autowired
	private ProductCardTools productCardTools;

	private final List<List<Product>> shownCards = new ArrayList<>();

	private final ToolContext toolContext =
		new ToolContext(new AssistantToolContext(null, shownCards::add).toMap());

	@Test
	void cardsAreShownInTheRequestedOrder() {
		ShownProductsDto result = productCardTools.showProducts(List.of(3L, 1L, 999L, 3L), toolContext);

		assertThat(result.shownIds()).containsExactly(3L, 1L);
		assertThat(result.notFoundIds()).containsExactly(999L);
		assertThat(shownCards).singleElement()
			.satisfies(cards -> assertThat(cards).extracting(Product::getId).containsExactly(3L, 1L));
	}

	@Test
	void cardsAreLimitedToSixProducts() {
		productCardTools.showProducts(List.of(1L, 2L, 3L, 5L, 6L, 7L, 8L), toolContext);

		assertThat(shownCards.getFirst()).hasSize(ProductCardTools.SHOWN_PRODUCTS_LIMIT);
	}

	@Test
	void unknownProductsShowNoCards() {
		ShownProductsDto result = productCardTools.showProducts(List.of(999L), toolContext);

		assertThat(result.shownIds()).isEmpty();
		assertThat(shownCards).isEmpty();
	}

}
