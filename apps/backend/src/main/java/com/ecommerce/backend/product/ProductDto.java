package com.ecommerce.backend.product;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(name = "Product")
public record ProductDto(
	@Schema(requiredMode = RequiredMode.REQUIRED) long id,
	@Schema(requiredMode = RequiredMode.REQUIRED) String name,
	@Schema(requiredMode = RequiredMode.REQUIRED) BigDecimal price) {
}
