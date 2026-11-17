package xyz.cursedman.psk.ecommerce.assistant.api.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = "ChatMessage")
public record ChatMessageDto(
	@Schema(requiredMode = RequiredMode.REQUIRED)
	@NotNull
	ChatRoleDto role,

	@Schema(
		requiredMode = RequiredMode.REQUIRED,
		maxLength = MAX_CONTENT_LENGTH,
		description = "User messages have between 1 and " + MAX_USER_CONTENT_LENGTH + " characters"
	)
	@NotNull
	@Size(max = MAX_CONTENT_LENGTH)
	String content,

	@Schema(description = "Ids of the products shown as cards under an assistant message")
	@Size(max = MAX_PRODUCT_IDS)
	List<@NotNull Long> productIds
) {

	public static final int MAX_USER_CONTENT_LENGTH = 1000;

	public static final int MAX_CONTENT_LENGTH = 4000;

	public static final int MAX_PRODUCT_IDS = 6;

	@JsonIgnore
	@AssertTrue(message = "user messages must have between 1 and " + MAX_USER_CONTENT_LENGTH + " characters")
	public boolean isUserContentLengthValid() {
		if (role != ChatRoleDto.USER || content == null) {
			return true;
		}

		return !content.isBlank() && content.length() <= MAX_USER_CONTENT_LENGTH;
	}

}
