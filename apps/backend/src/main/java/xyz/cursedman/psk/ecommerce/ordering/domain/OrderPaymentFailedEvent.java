package xyz.cursedman.psk.ecommerce.ordering.domain;

import java.util.Map;

/**
 * Published when an order's payment fails, so its reserved stock can be released.
 *
 * @param quantities ordered quantity by product id
 */
public record OrderPaymentFailedEvent(long orderId, Map<Long, Integer> quantities) {
}
