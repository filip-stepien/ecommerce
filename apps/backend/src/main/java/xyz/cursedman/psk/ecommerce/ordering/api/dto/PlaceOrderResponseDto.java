package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

import xyz.cursedman.psk.ecommerce.ordering.domain.OrderStatus;

@Schema(name = "PlaceOrderResponse")
public record PlaceOrderResponseDto(
	@Schema(requiredMode = RequiredMode.REQUIRED) long orderId,
	@Schema(requiredMode = RequiredMode.REQUIRED) OrderStatus status,
	@Schema(requiredMode = RequiredMode.REQUIRED) BigDecimal total,
	@Schema(requiredMode = RequiredMode.REQUIRED) String currency,
	@Schema(description = "Present when the payment provider needs the client to complete the payment")
	String clientSecret) {
}
