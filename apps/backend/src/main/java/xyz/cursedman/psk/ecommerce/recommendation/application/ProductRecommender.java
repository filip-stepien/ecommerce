package xyz.cursedman.psk.ecommerce.recommendation.application;

import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;

import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import xyz.cursedman.psk.ecommerce.catalog.domain.Product;
import xyz.cursedman.psk.ecommerce.recommendation.domain.CustomerPurchases;
import xyz.cursedman.psk.ecommerce.recommendation.domain.PurchaseHistory;
import xyz.cursedman.psk.ecommerce.recommendation.domain.RecommendationContext;
import xyz.cursedman.psk.ecommerce.recommendation.domain.RecommendationStrategy;

/**
 * Combines the recommendation strategies: asks each in order and fills the list with products not picked yet.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductRecommender {

	private final List<RecommendationStrategy> strategies;

	private final PurchaseHistory purchaseHistory;

	/**
	 * @param customerId Keycloak user id, or {@code null} for a guest
	 */
	public List<Product> recommend(@Nullable String customerId, int limit) {
		CustomerPurchases purchases = customerId != null
			? purchaseHistory.findByCustomer(customerId)
			: CustomerPurchases.none();
		Map<Long, Product> picked = new LinkedHashMap<>();

		for (RecommendationStrategy strategy : strategies) {
			if (picked.size() >= limit) {
				break;
			}
			Set<Long> excluded = new HashSet<>(purchases.productIds());
			excluded.addAll(picked.keySet());
			strategy.recommend(new RecommendationContext(purchases, Set.copyOf(excluded), limit - picked.size()))
				.stream()
				.filter(product -> !excluded.contains(product.getId()))
				.limit(limit - picked.size())
				.forEach(product -> picked.putIfAbsent(product.getId(), product));
		}

		List<Product> products = List.copyOf(picked.values());
		// Loaded while the session is open; batch fetching makes this a single query.
		products.forEach(product -> Hibernate.initialize(product.getImages()));
		return products;
	}

}
