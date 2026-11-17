package xyz.cursedman.psk.ecommerce.assistant.api;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import reactor.core.publisher.Flux;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import xyz.cursedman.psk.ecommerce.assistant.api.dto.AssistantDoneDto;
import xyz.cursedman.psk.ecommerce.assistant.api.dto.AssistantErrorDto;
import xyz.cursedman.psk.ecommerce.assistant.api.dto.AssistantStreamEventDto;
import xyz.cursedman.psk.ecommerce.assistant.api.dto.ChatRequestDto;
import xyz.cursedman.psk.ecommerce.assistant.application.AssistantChatService;
import xyz.cursedman.psk.ecommerce.assistant.domain.ConversationMessage;
import xyz.cursedman.psk.ecommerce.config.CurrentUserId;
import xyz.cursedman.psk.ecommerce.config.OpenApiConfig;

@Slf4j
@RestController
@RequestMapping("/api/assistant")
@Tag(name = "assistant")
@RequiredArgsConstructor
public class AssistantController {

	static final String REPLY_FAILED_MESSAGE = "Asystent jest chwilowo niedostępny. Spróbuj ponownie za chwilę.";

	private final AssistantChatService assistantChatService;

	private final AssistantMapper assistantMapper;

	@PostMapping(path = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	@Operation(
		operationId = "streamChat",
		summary = "Stream the assistant's reply to the conversation",
		description = """
			Public. With a token, the assistant takes the customer's recent purchases into account. \
			The reply is a stream of server-sent events whose data is an AssistantStreamEvent: \
			text and products events, ending with done, or with error when the reply failed."""
	)
	@ApiResponse(
		responseCode = "200",
		content = @Content(
			mediaType = MediaType.TEXT_EVENT_STREAM_VALUE,
			schema = @Schema(implementation = AssistantStreamEventDto.class)
		)
	)
	@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
	@SecurityRequirement(name = OpenApiConfig.KEYCLOAK_AUTH)
	public Flux<AssistantStreamEventDto> streamChat(
		@CurrentUserId @Nullable String customerId,
		@Valid @RequestBody ChatRequestDto request
	) {
		List<ConversationMessage> conversation = assistantMapper.toConversation(request.messages());

		return assistantChatService.generateReply(conversation, customerId)
			.map(assistantMapper::toStreamEvent)
			.concatWithValues(new AssistantDoneDto())
			.onErrorResume(exception -> {
				log.error("Assistant reply failed", exception);

				return Flux.just(new AssistantErrorDto(REPLY_FAILED_MESSAGE));
			});
	}

}
