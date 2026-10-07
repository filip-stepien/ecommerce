package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Schema(name = "Contact")
public record ContactDto(
	@NotBlank String firstName,
	@NotBlank String lastName,
	@NotBlank @Email String email,
	@NotBlank @Pattern(regexp = "^\\+?[\\d\\s-]{9,}$") String phone) {
}
