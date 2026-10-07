package xyz.cursedman.psk.ecommerce.recommendation.application.strategy;

import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.core.annotation.Order;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import xyz.cursedman.psk.ecommerce.catalog.domain.Product;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductRepository;
import xyz.cursedman.psk.ecommerce.recommendation.domain.RecommendationContext;
import xyz.cursedman.psk.ecommerce.recommendation.domain.RecommendationStrategy;

/**
 * Newest in-stock products. Comes last so the list is filled even without any sales.
 */
@Component
@Order(3)
@RequiredArgsConstructor
class NewestProductsStrategy implements RecommendationStrategy {

	private final ProductRepository productRepository;

	@Override
	public List<Product> recommend(RecommendationContext context) {
		Specification<Product> inStock = (root, query, cb) -> cb.greaterThan(root.get("stock"), 0);
		PageRequest newestFirst = PageRequest.of(
			0, context.limit() + context.excludedProductIds().size(), Sort.by(Sort.Direction.DESC, "id"));
		return productRepository.findAll(inStock, newestFirst).stream()
			.filter(product -> !context.excludedProductIds().contains(product.getId()))
			.limit(context.limit())
			.toList();
	}

}
