package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import xyz.cursedman.psk.ecommerce.payment.domain.PaymentMethod;

/**
 * The checkout form. Card details are never sent to the API.
 */
@Schema(name = "OrderDetails")
@ValidInvoice
public record OrderDetailsDto(
	@NotNull @Valid ContactDto contact,
	@NotNull @Valid AddressDto address,
	@NotNull Boolean isInvoiceSameAsDelivery,
	@Schema(description = "Validated and used only when isInvoiceSameAsDelivery is false")
	InvoiceDto invoice,
	@NotBlank String deliveryMethod,
	@NotNull PaymentMethod paymentMethod) {
}
