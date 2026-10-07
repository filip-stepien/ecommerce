package xyz.cursedman.psk.ecommerce.catalog.domain;

import java.math.BigDecimal;

public record ProductFilter(
	String search,
	String category,
	String brand,
	String connectivity,
	BigDecimal minPrice,
	BigDecimal maxPrice,
	boolean onlyAvailable) {
}
