package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import java.math.BigDecimal;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(name = "CheckoutOptions")
public record CheckoutOptionsDto(
	@Schema(requiredMode = RequiredMode.REQUIRED) List<DeliveryMethodDto> deliveryMethods,
	@Schema(requiredMode = RequiredMode.REQUIRED) List<PaymentMethodDto> paymentMethods,
	@Schema(requiredMode = RequiredMode.REQUIRED, description = "VAT rate included in all prices")
	BigDecimal vatRate) {
}
