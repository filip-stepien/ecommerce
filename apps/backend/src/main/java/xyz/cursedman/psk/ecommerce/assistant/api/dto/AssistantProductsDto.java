package xyz.cursedman.psk.ecommerce.assistant.api.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

import xyz.cursedman.psk.ecommerce.catalog.api.dto.ProductDto;

@Schema(name = "AssistantProducts", description = "Products to show as cards under the reply")
public record AssistantProductsDto(
	@Schema(requiredMode = RequiredMode.REQUIRED)
	List<ProductDto> products
) implements AssistantStreamEventDto {

	public static final String TYPE = "products";

	@Override
	@JsonProperty
	@Schema(requiredMode = RequiredMode.REQUIRED, allowableValues = TYPE)
	public String type() {
		return TYPE;
	}

}
