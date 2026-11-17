package xyz.cursedman.psk.ecommerce.assistant.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(name = "AssistantError", description = "The reply failed; the message can be shown to the customer")
public record AssistantErrorDto(
	@Schema(requiredMode = RequiredMode.REQUIRED)
	String message
) implements AssistantStreamEventDto {

	public static final String TYPE = "error";

	@Override
	@JsonProperty
	@Schema(requiredMode = RequiredMode.REQUIRED, allowableValues = TYPE)
	public String type() {
		return TYPE;
	}

}
