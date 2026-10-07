package xyz.cursedman.psk.ecommerce.catalog.domain.exception;

import java.util.Collection;

import xyz.cursedman.psk.ecommerce.shared.domain.exception.NotFoundException;

public class ProductNotFoundException extends NotFoundException {

	public ProductNotFoundException(long id) {
		super("Product %d not found".formatted(id));
	}

	public ProductNotFoundException(Collection<Long> ids) {
		super("Products not found: " + ids);
	}

}
