package xyz.cursedman.psk.ecommerce.assistant.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ChatRole")
public enum ChatRoleDto {

	@JsonProperty("user")
	USER,

	@JsonProperty("assistant")
	ASSISTANT

}
