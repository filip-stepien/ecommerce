package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(name = "PurchasedItem")
public record PurchasedItemDto(
	@Schema(requiredMode = RequiredMode.REQUIRED) long productId,
	@Schema(requiredMode = RequiredMode.REQUIRED) String name,
	String image,
	@Schema(requiredMode = RequiredMode.REQUIRED) int quantity,
	@Schema(requiredMode = RequiredMode.REQUIRED) BigDecimal unitPrice,
	@Schema(requiredMode = RequiredMode.REQUIRED) BigDecimal lineTotal) {
}
