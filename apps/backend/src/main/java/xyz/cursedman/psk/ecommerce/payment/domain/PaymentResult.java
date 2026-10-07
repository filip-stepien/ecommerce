package xyz.cursedman.psk.ecommerce.payment.domain;

/**
 * Outcome of starting a payment. Providers that settle asynchronously (e.g. Stripe) return
 * {@link RequiresAction} and report the final result later, typically through a webhook.
 */
public sealed interface PaymentResult {

	record Succeeded(String paymentId) implements PaymentResult {
	}

	record Failed(String reason) implements PaymentResult {
	}

	record RequiresAction(String paymentId, String clientSecret) implements PaymentResult {
	}

}
