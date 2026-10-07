package xyz.cursedman.psk.ecommerce.recommendation.application.strategy;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import xyz.cursedman.psk.ecommerce.catalog.domain.Product;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductRepository;
import xyz.cursedman.psk.ecommerce.recommendation.domain.RecommendationContext;
import xyz.cursedman.psk.ecommerce.recommendation.domain.RecommendationStrategy;
import xyz.cursedman.psk.ecommerce.recommendation.domain.SalesStatistics;

/**
 * Best-selling products, by units sold in paid orders.
 */
@Component
@Order(2)
@RequiredArgsConstructor
class BestsellerStrategy implements RecommendationStrategy {

	private final ProductRepository productRepository;

	private final SalesStatistics salesStatistics;

	@Override
	public List<Product> recommend(RecommendationContext context) {
		// Excluded ids are dropped after the query, so ask for enough to still fill the limit.
		List<Long> ids = salesStatistics
			.findBestsellingProductIds(context.limit() + context.excludedProductIds().size()).stream()
			.filter(id -> !context.excludedProductIds().contains(id))
			.toList();
		Map<Long, Product> products = productRepository.findAllById(ids).stream()
			.collect(Collectors.toMap(Product::getId, Function.identity()));
		return ids.stream()
			.map(products::get)
			.filter(product -> product != null && product.getStock() > 0)
			.limit(context.limit())
			.toList();
	}

}
