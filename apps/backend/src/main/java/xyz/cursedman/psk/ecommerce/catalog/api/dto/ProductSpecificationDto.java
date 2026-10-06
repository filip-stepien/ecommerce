package xyz.cursedman.psk.ecommerce.catalog.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(name = "ProductSpecification")
public record ProductSpecificationDto(
	@Schema(requiredMode = RequiredMode.REQUIRED) String name,
	@Schema(requiredMode = RequiredMode.REQUIRED) String value) {
}
