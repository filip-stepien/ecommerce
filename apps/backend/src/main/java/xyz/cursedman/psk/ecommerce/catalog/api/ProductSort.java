package xyz.cursedman.psk.ecommerce.catalog.api;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Sort;

@RequiredArgsConstructor
public enum ProductSort {

	DEFAULT("default", Sort.by("id")),
	PRICE_ASC("priceAsc", Sort.by("price").ascending().and(Sort.by("id"))),
	PRICE_DESC("priceDesc", Sort.by("price").descending().and(Sort.by("id"))),
	NAME_ASC("nameAsc", Sort.by("name").ascending().and(Sort.by("id")));

	@Getter(onMethod_ = @JsonValue)
	private final String value;

	@Getter
	private final Sort sort;

	public static ProductSort fromValue(String value) {
		for (ProductSort productSort : values()) {
			if (productSort.value.equals(value)) {
				return productSort;
			}
		}
		throw new IllegalArgumentException("Unknown product sort: " + value);
	}

}
