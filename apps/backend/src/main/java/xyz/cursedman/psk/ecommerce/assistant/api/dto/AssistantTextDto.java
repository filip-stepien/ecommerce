package xyz.cursedman.psk.ecommerce.assistant.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(name = "AssistantText", description = "The next fragment of the reply text")
public record AssistantTextDto(
	@Schema(requiredMode = RequiredMode.REQUIRED)
	String text
) implements AssistantStreamEventDto {

	public static final String TYPE = "text";

	@Override
	@JsonProperty
	@Schema(requiredMode = RequiredMode.REQUIRED, allowableValues = TYPE)
	public String type() {
		return TYPE;
	}

}
