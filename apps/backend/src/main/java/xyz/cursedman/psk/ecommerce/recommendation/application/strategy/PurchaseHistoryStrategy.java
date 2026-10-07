package xyz.cursedman.psk.ecommerce.recommendation.application.strategy;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;

import org.springframework.core.annotation.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import xyz.cursedman.psk.ecommerce.catalog.domain.Product;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductRepository;
import xyz.cursedman.psk.ecommerce.recommendation.domain.CustomerPurchases;
import xyz.cursedman.psk.ecommerce.recommendation.domain.RecommendationContext;
import xyz.cursedman.psk.ecommerce.recommendation.domain.RecommendationStrategy;
import xyz.cursedman.psk.ecommerce.recommendation.domain.SalesStatistics;

/**
 * "For you": products from the categories and brands the customer buys, a category match weighing more
 * than a brand match. Ties go to the better-selling product.
 */
@Component
@Order(1)
@RequiredArgsConstructor
class PurchaseHistoryStrategy implements RecommendationStrategy {

	private static final int CATEGORY_WEIGHT = 2;

	private static final int BRAND_WEIGHT = 1;

	private final ProductRepository productRepository;

	private final SalesStatistics salesStatistics;

	@Override
	public List<Product> recommend(RecommendationContext context) {
		CustomerPurchases purchases = context.purchases();
		if (purchases.isEmpty()) {
			return List.of();
		}
		List<Product> candidates = productRepository.findAll(inStockAndMatching(purchases)).stream()
			.filter(product -> !context.excludedProductIds().contains(product.getId()))
			.toList();
		Map<Long, Long> sold = salesStatistics.findSoldQuantities(candidates.stream().map(Product::getId).toList());

		Comparator<Product> byScore = Comparator.comparingLong(product -> score(product, purchases));
		Comparator<Product> bySales = Comparator.comparingLong(product -> sold.getOrDefault(product.getId(), 0L));
		return candidates.stream()
			.sorted(byScore.reversed().thenComparing(bySales.reversed()).thenComparing(Product::getId, Comparator.reverseOrder()))
			.limit(context.limit())
			.toList();
	}

	private static long score(Product product, CustomerPurchases purchases) {
		return CATEGORY_WEIGHT * purchases.categoryWeights().getOrDefault(product.getCategory(), 0L)
			+ BRAND_WEIGHT * purchases.brandWeights().getOrDefault(product.getBrand(), 0L);
	}

	private static Specification<Product> inStockAndMatching(CustomerPurchases purchases) {
		return (root, query, cb) -> cb.and(
			cb.greaterThan(root.get("stock"), 0),
			cb.or(
				root.get("category").in(purchases.categoryWeights().keySet()),
				root.get("brand").in(purchases.brandWeights().keySet())));
	}

}
