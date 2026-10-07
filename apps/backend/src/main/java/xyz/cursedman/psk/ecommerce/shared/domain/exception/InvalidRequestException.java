package xyz.cursedman.psk.ecommerce.shared.domain.exception;

/**
 * The request refers to something that is not allowed, e.g. an unknown delivery method.
 */
public class InvalidRequestException extends DomainException {

	public InvalidRequestException(String message) {
		super(message);
	}

}
