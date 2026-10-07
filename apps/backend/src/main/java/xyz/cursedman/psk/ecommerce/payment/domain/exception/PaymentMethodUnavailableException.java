package xyz.cursedman.psk.ecommerce.payment.domain.exception;

import xyz.cursedman.psk.ecommerce.payment.domain.PaymentMethod;
import xyz.cursedman.psk.ecommerce.shared.domain.exception.InvalidRequestException;

public class PaymentMethodUnavailableException extends InvalidRequestException {

	public PaymentMethodUnavailableException(PaymentMethod method) {
		super("Payment method %s is not available".formatted(method.getId()));
	}

}
