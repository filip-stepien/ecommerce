package xyz.cursedman.psk.ecommerce.assistant.api.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = "ChatRequest")
public record ChatRequestDto(
	@Schema(
		requiredMode = RequiredMode.REQUIRED,
		description = "The conversation, oldest message first; the last message comes from the user"
	)
	@NotEmpty
	@Size(max = MAX_MESSAGES)
	List<@Valid @NotNull ChatMessageDto> messages
) {

	public static final int MAX_MESSAGES = 20;

	@JsonIgnore
	@AssertTrue(message = "the last message must come from the user")
	public boolean isLastMessageFromUser() {
		if (messages == null || messages.isEmpty() || messages.getLast() == null) {
			return true;
		}

		return messages.getLast().role() == ChatRoleDto.USER;
	}

}
