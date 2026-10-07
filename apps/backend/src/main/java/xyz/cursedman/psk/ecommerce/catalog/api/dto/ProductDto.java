package xyz.cursedman.psk.ecommerce.catalog.api.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(name = "Product")
public record ProductDto(
	@Schema(requiredMode = RequiredMode.REQUIRED) long id,
	@Schema(requiredMode = RequiredMode.REQUIRED) String name,
	@Schema(requiredMode = RequiredMode.REQUIRED) BigDecimal price,
	@Schema(description = "First product image, if any") String imageUrl) {
}
