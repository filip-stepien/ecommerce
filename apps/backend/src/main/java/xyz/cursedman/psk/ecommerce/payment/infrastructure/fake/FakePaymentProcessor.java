package xyz.cursedman.psk.ecommerce.payment.infrastructure.fake;

import java.util.EnumSet;
import java.util.Set;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import xyz.cursedman.psk.ecommerce.payment.domain.PaymentMethod;
import xyz.cursedman.psk.ecommerce.payment.domain.PaymentProcessor;
import xyz.cursedman.psk.ecommerce.payment.domain.PaymentRequest;
import xyz.cursedman.psk.ecommerce.payment.domain.PaymentResult;

/**
 * Settles every payment immediately without contacting a payment provider.
 */
@Slf4j
@Component
@ConditionalOnProperty(name = "shop.payments.provider", havingValue = "fake", matchIfMissing = true)
@RequiredArgsConstructor
class FakePaymentProcessor implements PaymentProcessor {

	private final FakePaymentProperties properties;

	@Override
	public Set<PaymentMethod> supportedMethods() {
		return EnumSet.allOf(PaymentMethod.class);
	}

	@Override
	public PaymentResult process(PaymentRequest request) {
		log.info("Fake {} payment of {} {} for order {}",
			request.method().getId(), request.amount(), request.currency(), request.orderId());
		if (properties.decline()) {
			return new PaymentResult.Failed("Payment declined by the fake payment provider");
		}
		return new PaymentResult.Succeeded("fake-" + UUID.randomUUID());
	}

}
