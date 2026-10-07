package xyz.cursedman.psk.ecommerce.catalog.api.dto;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(name = "ProductPage")
public record ProductPageDto(
	@Schema(requiredMode = RequiredMode.REQUIRED) List<ProductDto> products,
	@Schema(requiredMode = RequiredMode.REQUIRED, description = "Number of products matching the filters")
	long total) {
}
