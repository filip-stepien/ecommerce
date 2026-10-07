package xyz.cursedman.psk.ecommerce.recommendation.domain;

import java.util.Map;
import java.util.Set;

/**
 * What a customer has bought in paid orders.
 *
 * @param categoryWeights units bought per category
 * @param brandWeights units bought per brand
 */
public record CustomerPurchases(Set<Long> productIds, Map<String, Long> categoryWeights, Map<String, Long> brandWeights) {

	public static CustomerPurchases none() {
		return new CustomerPurchases(Set.of(), Map.of(), Map.of());
	}

	public boolean isEmpty() {
		return productIds.isEmpty();
	}

}
