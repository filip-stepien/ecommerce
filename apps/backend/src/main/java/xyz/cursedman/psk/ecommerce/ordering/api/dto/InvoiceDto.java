package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Schema(name = "Invoice")
public record InvoiceDto(
	@NotBlank String name,
	@Schema(description = "Polish NIP, 10 digits, optionally dash-separated")
	@Pattern(regexp = "^(\\d{3}-?\\d{3}-?\\d{2}-?\\d{2})?$") String taxId,
	@NotNull @Valid AddressDto address) {
}
