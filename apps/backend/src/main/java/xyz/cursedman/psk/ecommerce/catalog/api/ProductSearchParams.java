package xyz.cursedman.psk.ecommerce.catalog.api;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;

public record ProductSearchParams(
	@Schema(description = "Case-insensitive fragment of the product name") String search,
	String category,
	String brand,
	String connectivity,
	@PositiveOrZero BigDecimal minPrice,
	@PositiveOrZero BigDecimal maxPrice,
	@Schema(defaultValue = "false") Boolean onlyAvailable,
	@Schema(defaultValue = "default") ProductSort sort,
	@Schema(description = "1-based page number", defaultValue = "1") @Min(1) Integer page,
	@Schema(defaultValue = "12") @Min(1) @Max(100) Integer pageSize) {

	public ProductSearchParams {
		onlyAvailable = onlyAvailable != null && onlyAvailable;
		sort = sort != null ? sort : ProductSort.DEFAULT;
		page = page != null ? page : 1;
		pageSize = pageSize != null ? pageSize : 12;
	}

}
