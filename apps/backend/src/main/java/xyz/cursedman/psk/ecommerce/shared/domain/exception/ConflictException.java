package xyz.cursedman.psk.ecommerce.shared.domain.exception;

/**
 * The request is valid but conflicts with the current state, e.g. insufficient stock.
 */
public class ConflictException extends DomainException {

	public ConflictException(String message) {
		super(message);
	}

}
