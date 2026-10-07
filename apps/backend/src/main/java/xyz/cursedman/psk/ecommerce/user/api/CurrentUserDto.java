package xyz.cursedman.psk.ecommerce.user.api;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(name = "CurrentUser")
public record CurrentUserDto(
	@Schema(requiredMode = RequiredMode.REQUIRED) String username,
	String email,
	@Schema(requiredMode = RequiredMode.REQUIRED) List<String> roles) {
}
