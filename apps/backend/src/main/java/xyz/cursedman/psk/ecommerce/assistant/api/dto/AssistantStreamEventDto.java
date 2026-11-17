package xyz.cursedman.psk.ecommerce.assistant.api.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;

@JsonPropertyOrder("type")
@Schema(
	name = "AssistantStreamEvent",
	description = "One event of the assistant's reply stream; the stream ends after done or error",
	oneOf = { AssistantTextDto.class, AssistantProductsDto.class, AssistantDoneDto.class, AssistantErrorDto.class },
	discriminatorProperty = "type",
	discriminatorMapping = {
		@DiscriminatorMapping(value = AssistantTextDto.TYPE, schema = AssistantTextDto.class),
		@DiscriminatorMapping(value = AssistantProductsDto.TYPE, schema = AssistantProductsDto.class),
		@DiscriminatorMapping(value = AssistantDoneDto.TYPE, schema = AssistantDoneDto.class),
		@DiscriminatorMapping(value = AssistantErrorDto.TYPE, schema = AssistantErrorDto.class)
	}
)
public sealed interface AssistantStreamEventDto
	permits AssistantTextDto, AssistantProductsDto, AssistantDoneDto, AssistantErrorDto {

	String type();

}
