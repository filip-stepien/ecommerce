package xyz.cursedman.psk.ecommerce.payment.application;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

import xyz.cursedman.psk.ecommerce.payment.domain.PaymentMethod;
import xyz.cursedman.psk.ecommerce.payment.domain.PaymentProcessor;
import xyz.cursedman.psk.ecommerce.payment.domain.PaymentRequest;
import xyz.cursedman.psk.ecommerce.payment.domain.PaymentResult;
import xyz.cursedman.psk.ecommerce.payment.domain.exception.PaymentMethodUnavailableException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PaymentProcessorRegistryTests {

	record StubProcessor(Set<PaymentMethod> supportedMethods) implements PaymentProcessor {

		@Override
		public PaymentResult process(PaymentRequest request) {
			return new PaymentResult.Succeeded("stub");
		}

	}

	@Test
	void picksProcessorByMethod() {
		StubProcessor blik = new StubProcessor(EnumSet.of(PaymentMethod.BLIK));
		StubProcessor card = new StubProcessor(EnumSet.of(PaymentMethod.CARD));
		PaymentProcessorRegistry registry = new PaymentProcessorRegistry(List.of(card, blik));

		assertThat(registry.processorFor(PaymentMethod.BLIK)).isSameAs(blik);
		assertThat(registry.processorFor(PaymentMethod.CARD)).isSameAs(card);
		assertThat(registry.availableMethods()).containsExactly(PaymentMethod.BLIK, PaymentMethod.CARD);
	}

	@Test
	void rejectsMethodWithoutProcessor() {
		PaymentProcessorRegistry registry = new PaymentProcessorRegistry(
			List.of(new StubProcessor(EnumSet.of(PaymentMethod.BLIK))));

		assertThat(registry.availableMethods()).containsExactly(PaymentMethod.BLIK);
		assertThatThrownBy(() -> registry.processorFor(PaymentMethod.CARD))
			.isInstanceOf(PaymentMethodUnavailableException.class);
	}

	@Test
	void rejectsTwoProcessorsForOneMethod() {
		List<PaymentProcessor> processors = List.of(
			new StubProcessor(EnumSet.of(PaymentMethod.BLIK)),
			new StubProcessor(EnumSet.allOf(PaymentMethod.class)));

		assertThatThrownBy(() -> new PaymentProcessorRegistry(processors))
			.isInstanceOf(IllegalStateException.class);
	}

}
