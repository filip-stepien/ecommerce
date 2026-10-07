package xyz.cursedman.psk.ecommerce.payment.application;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import xyz.cursedman.psk.ecommerce.payment.domain.PaymentMethod;
import xyz.cursedman.psk.ecommerce.payment.domain.PaymentProcessor;
import xyz.cursedman.psk.ecommerce.payment.domain.exception.PaymentMethodUnavailableException;

/**
 * Picks the {@link PaymentProcessor} for a payment method. Every processor bean registers
 * itself, so adding a payment method needs no change here.
 */
@Component
public class PaymentProcessorRegistry {

	private final Map<PaymentMethod, PaymentProcessor> processors = new EnumMap<>(PaymentMethod.class);

	public PaymentProcessorRegistry(List<PaymentProcessor> processors) {
		processors.forEach(processor -> processor.supportedMethods().forEach(method -> {
			PaymentProcessor previous = this.processors.putIfAbsent(method, processor);
			if (previous != null) {
				throw new IllegalStateException("Payment method %s is handled by both %s and %s"
					.formatted(method, previous.getClass().getSimpleName(), processor.getClass().getSimpleName()));
			}
		}));
	}

	public List<PaymentMethod> availableMethods() {
		return List.copyOf(processors.keySet());
	}

	public PaymentProcessor processorFor(PaymentMethod method) {
		PaymentProcessor processor = processors.get(method);
		if (processor == null) {
			throw new PaymentMethodUnavailableException(method);
		}
		return processor;
	}

}
