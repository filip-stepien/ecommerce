package xyz.cursedman.psk.ecommerce.catalog.api.dto;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(name = "ProductFilterOptions")
public record ProductFilterOptionsDto(
	@Schema(requiredMode = RequiredMode.REQUIRED) List<String> connectivityOptions,
	@Schema(requiredMode = RequiredMode.REQUIRED) List<String> brands) {
}
