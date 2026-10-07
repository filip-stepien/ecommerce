package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

import xyz.cursedman.psk.ecommerce.payment.domain.PaymentMethod;

@Schema(name = "PaymentMethodOption")
public record PaymentMethodDto(
	@Schema(requiredMode = RequiredMode.REQUIRED) PaymentMethod id,
	@Schema(requiredMode = RequiredMode.REQUIRED) String name) {
}
