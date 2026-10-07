package xyz.cursedman.psk.ecommerce.ordering.domain.exception;

import xyz.cursedman.psk.ecommerce.shared.domain.exception.InvalidRequestException;

public class UnknownDeliveryMethodException extends InvalidRequestException {

	public UnknownDeliveryMethodException(String deliveryMethod) {
		super("Unknown delivery method " + deliveryMethod);
	}

}
