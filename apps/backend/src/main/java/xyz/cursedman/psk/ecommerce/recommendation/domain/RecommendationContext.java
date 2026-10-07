package xyz.cursedman.psk.ecommerce.recommendation.domain;

import java.util.Set;

/**
 * @param purchases what the customer bought, empty for guests
 * @param excludedProductIds products that must not be recommended (already bought or already picked)
 * @param limit how many products are still needed
 */
public record RecommendationContext(CustomerPurchases purchases, Set<Long> excludedProductIds, int limit) {
}
