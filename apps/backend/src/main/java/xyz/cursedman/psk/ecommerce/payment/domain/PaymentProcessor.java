package xyz.cursedman.psk.ecommerce.payment.domain;

import java.util.Set;

/**
 * Strategy for charging an order with one or more payment methods. Implementations report a
 * declined payment as {@link PaymentResult.Failed} rather than throwing.
 */
public interface PaymentProcessor {

	Set<PaymentMethod> supportedMethods();

	PaymentResult process(PaymentRequest request);

}
