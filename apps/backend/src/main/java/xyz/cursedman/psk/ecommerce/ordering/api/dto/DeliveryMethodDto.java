package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(name = "DeliveryMethod")
public record DeliveryMethodDto(
	@Schema(requiredMode = RequiredMode.REQUIRED) String id,
	@Schema(requiredMode = RequiredMode.REQUIRED) String name,
	@Schema(requiredMode = RequiredMode.REQUIRED) BigDecimal price) {
}
