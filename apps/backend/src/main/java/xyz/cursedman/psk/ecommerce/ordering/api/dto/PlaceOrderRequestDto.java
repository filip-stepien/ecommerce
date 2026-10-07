package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Schema(name = "PlaceOrderRequest")
public record PlaceOrderRequestDto(
	@NotEmpty List<@NotNull @Valid OrderItemDto> items,
	@NotNull @Valid OrderDetailsDto details) {
}
