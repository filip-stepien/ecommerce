package xyz.cursedman.psk.ecommerce.recommendation.domain;

import java.util.List;

import xyz.cursedman.psk.ecommerce.catalog.domain.Product;

/**
 * One way of picking products to recommend. Strategies are tried in {@code @Order}; later ones fill
 * the places earlier ones left empty.
 */
public interface RecommendationStrategy {

	/**
	 * @return at most {@code context.limit()} in-stock products, best first, none of them excluded
	 */
	List<Product> recommend(RecommendationContext context);

}
