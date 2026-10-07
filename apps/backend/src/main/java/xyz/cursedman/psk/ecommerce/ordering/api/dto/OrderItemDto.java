package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * A cart line. Other cart fields (name, price, image) may be sent but are ignored; prices come from the catalog.
 */
@Schema(name = "OrderItem")
public record OrderItemDto(
	@Schema(description = "Product id") @NotNull Long id,
	@NotNull @Positive @Max(999) Integer quantity) {
}
