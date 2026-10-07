package xyz.cursedman.psk.ecommerce.ordering.application;

import xyz.cursedman.psk.ecommerce.ordering.domain.Order;

/**
 * @param clientSecret secret the client needs to complete the payment, when the provider requires an action
 */
public record PlaceOrderResult(Order order, String clientSecret) {
}
