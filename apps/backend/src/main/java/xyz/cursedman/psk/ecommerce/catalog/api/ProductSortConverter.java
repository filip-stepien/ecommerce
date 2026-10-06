package xyz.cursedman.psk.ecommerce.catalog.api;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

/**
 * Binds the {@code sort} query parameter by its API value (e.g. {@code priceAsc}) instead of the enum name.
 */
@Component
class ProductSortConverter implements Converter<String, ProductSort> {

	@Override
	public ProductSort convert(String source) {
		return ProductSort.fromValue(source);
	}

}
