package xyz.cursedman.psk.ecommerce.recommendation.application;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Test;

import org.springframework.beans.BeanUtils;
import org.springframework.test.util.ReflectionTestUtils;

import xyz.cursedman.psk.ecommerce.catalog.domain.Product;
import xyz.cursedman.psk.ecommerce.recommendation.domain.CustomerPurchases;
import xyz.cursedman.psk.ecommerce.recommendation.domain.PurchaseHistory;
import xyz.cursedman.psk.ecommerce.recommendation.domain.RecommendationContext;
import xyz.cursedman.psk.ecommerce.recommendation.domain.RecommendationStrategy;

import static org.assertj.core.api.Assertions.assertThat;

class ProductRecommenderTests {

	static Product product(long id) {
		Product product = BeanUtils.instantiateClass(Product.class);
		ReflectionTestUtils.setField(product, "id", id);
		ReflectionTestUtils.setField(product, "price", BigDecimal.ONE);
		return product;
	}

	/** Returns its products and records the contexts it was asked with. */
	static class StubStrategy implements RecommendationStrategy {

		final List<Product> products;

		final List<RecommendationContext> contexts = new ArrayList<>();

		StubStrategy(long... ids) {
			this.products = Arrays.stream(ids).mapToObj(ProductRecommenderTests::product).toList();
		}

		@Override
		public List<Product> recommend(RecommendationContext context) {
			contexts.add(context);
			return products;
		}

	}

	static final PurchaseHistory BOUGHT_PRODUCT_1 =
		customerId -> new CustomerPurchases(Set.of(1L), Map.of("Audio", 1L), Map.of("Sony", 1L));

	static List<Long> ids(List<Product> products) {
		return products.stream().map(Product::getId).toList();
	}

	@Test
	void fillsFromLaterStrategiesWithoutDuplicates() {
		StubStrategy first = new StubStrategy(2, 3);
		StubStrategy second = new StubStrategy(3, 4, 5);
		ProductRecommender recommender = new ProductRecommender(List.of(first, second), BOUGHT_PRODUCT_1);

		assertThat(ids(recommender.recommend("customer", 4))).containsExactly(2L, 3L, 4L, 5L);
		assertThat(second.contexts).singleElement().satisfies(context -> {
			assertThat(context.limit()).isEqualTo(2);
			assertThat(context.excludedProductIds()).containsExactlyInAnyOrder(1L, 2L, 3L);
		});
	}

	@Test
	void stopsOnceLimitIsReached() {
		StubStrategy first = new StubStrategy(2, 3, 4);
		StubStrategy second = new StubStrategy(5);
		ProductRecommender recommender = new ProductRecommender(List.of(first, second), BOUGHT_PRODUCT_1);

		assertThat(ids(recommender.recommend("customer", 2))).containsExactly(2L, 3L);
		assertThat(second.contexts).isEmpty();
	}

	@Test
	void neverRecommendsBoughtProducts() {
		ProductRecommender recommender = new ProductRecommender(List.of(new StubStrategy(1, 2)), BOUGHT_PRODUCT_1);

		assertThat(ids(recommender.recommend("customer", 5))).containsExactly(2L);
	}

	@Test
	void guestHasNoPurchases() {
		StubStrategy strategy = new StubStrategy(1);
		ProductRecommender recommender = new ProductRecommender(List.of(strategy), BOUGHT_PRODUCT_1);

		assertThat(ids(recommender.recommend(null, 5))).containsExactly(1L);
		assertThat(strategy.contexts.getFirst().purchases().isEmpty()).isTrue();
	}

}
