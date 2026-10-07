package xyz.cursedman.psk.ecommerce.catalog.api.dto;

import java.math.BigDecimal;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(name = "ProductDetails")
public record ProductDetailsDto(
	@Schema(requiredMode = RequiredMode.REQUIRED) long id,
	@Schema(requiredMode = RequiredMode.REQUIRED) String name,
	String subtitle,
	String description,
	@Schema(requiredMode = RequiredMode.REQUIRED) String brand,
	@Schema(requiredMode = RequiredMode.REQUIRED) String category,
	@Schema(requiredMode = RequiredMode.REQUIRED) BigDecimal price,
	@Schema(requiredMode = RequiredMode.REQUIRED) int stock,
	@Schema(requiredMode = RequiredMode.REQUIRED) List<String> connectivity,
	@Schema(requiredMode = RequiredMode.REQUIRED) List<String> images,
	@Schema(requiredMode = RequiredMode.REQUIRED) List<ProductSpecificationDto> specifications) {
}
