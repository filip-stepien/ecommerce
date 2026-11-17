package xyz.cursedman.psk.ecommerce.assistant.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(name = "AssistantDone", description = "The reply is complete")
public record AssistantDoneDto() implements AssistantStreamEventDto {

	public static final String TYPE = "done";

	@Override
	@JsonProperty
	@Schema(requiredMode = RequiredMode.REQUIRED, allowableValues = TYPE)
	public String type() {
		return TYPE;
	}

}
