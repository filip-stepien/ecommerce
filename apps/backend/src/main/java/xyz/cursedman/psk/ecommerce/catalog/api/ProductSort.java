package xyz.cursedman.psk.ecommerce.catalog.api;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum ProductSort {

	DEFAULT("default"),
	PRICE_ASC("priceAsc"),
	PRICE_DESC("priceDesc"),
	NAME_ASC("nameAsc");

	@Getter(onMethod_ = @JsonValue)
	private final String value;

	public static ProductSort fromValue(String value) {
		for (ProductSort productSort : values()) {
			if (productSort.value.equals(value)) {
				return productSort;
			}
		}
		throw new IllegalArgumentException("Unknown product sort: " + value);
	}

}
