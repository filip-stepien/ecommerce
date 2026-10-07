package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(name = "Address")
public record AddressDto(
	@NotBlank String street,
	@NotBlank String houseNumber,
	@NotBlank String postalCode,
	@NotBlank String city,
	@NotBlank String country) {
}
