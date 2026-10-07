package xyz.cursedman.psk.ecommerce.catalog.domain.exception;

import xyz.cursedman.psk.ecommerce.shared.domain.exception.ConflictException;

public class InsufficientStockException extends ConflictException {

	public InsufficientStockException(long productId, String productName, int requested, int available) {
		super("Insufficient stock for product %d (%s): requested %d, available %d"
			.formatted(productId, productName, requested, available));
	}

}
