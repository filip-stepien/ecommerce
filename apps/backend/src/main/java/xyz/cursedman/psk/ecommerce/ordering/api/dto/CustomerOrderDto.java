package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

import xyz.cursedman.psk.ecommerce.ordering.domain.OrderStatus;
import xyz.cursedman.psk.ecommerce.payment.domain.PaymentMethod;

@Schema(name = "CustomerOrder")
public record CustomerOrderDto(
	@Schema(requiredMode = RequiredMode.REQUIRED) long id,
	@Schema(requiredMode = RequiredMode.REQUIRED) OrderStatus status,
	@Schema(requiredMode = RequiredMode.REQUIRED) Instant createdAt,
	@Schema(requiredMode = RequiredMode.REQUIRED) ContactDto contact,
	@Schema(requiredMode = RequiredMode.REQUIRED) AddressDto deliveryAddress,
	InvoiceDto invoice,
	@Schema(requiredMode = RequiredMode.REQUIRED) List<PurchasedItemDto> items,
	@Schema(requiredMode = RequiredMode.REQUIRED) String deliveryMethod,
	@Schema(requiredMode = RequiredMode.REQUIRED) BigDecimal deliveryPrice,
	@Schema(requiredMode = RequiredMode.REQUIRED) PaymentMethod paymentMethod,
	String paymentId,
	String paymentFailureReason,
	@Schema(requiredMode = RequiredMode.REQUIRED) BigDecimal itemsTotal,
	@Schema(requiredMode = RequiredMode.REQUIRED) BigDecimal total,
	@Schema(requiredMode = RequiredMode.REQUIRED) BigDecimal vatAmount,
	@Schema(requiredMode = RequiredMode.REQUIRED) String currency) {
}
