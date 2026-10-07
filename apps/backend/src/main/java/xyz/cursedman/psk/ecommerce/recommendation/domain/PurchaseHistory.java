package xyz.cursedman.psk.ecommerce.recommendation.domain;

/**
 * Port to the customers' paid orders.
 */
public interface PurchaseHistory {

	CustomerPurchases findByCustomer(String customerId);

}
