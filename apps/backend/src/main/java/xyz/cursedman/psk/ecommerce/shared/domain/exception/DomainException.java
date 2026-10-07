package xyz.cursedman.psk.ecommerce.shared.domain.exception;

/**
 * Base class for expected business errors. The API layer turns them into problem details.
 */
public abstract class DomainException extends RuntimeException {

	protected DomainException(String message) {
		super(message);
	}

}
