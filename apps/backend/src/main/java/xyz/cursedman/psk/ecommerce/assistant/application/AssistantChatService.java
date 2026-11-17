package xyz.cursedman.psk.ecommerce.assistant.application;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import reactor.core.publisher.Flux;

import org.springframework.stereotype.Service;

import xyz.cursedman.psk.ecommerce.assistant.domain.AssistantModel;
import xyz.cursedman.psk.ecommerce.assistant.domain.ConversationMessage;
import xyz.cursedman.psk.ecommerce.assistant.domain.ReplyChunk;
import xyz.cursedman.psk.ecommerce.assistant.domain.ReplyText;

@Service
@RequiredArgsConstructor
public class AssistantChatService {

	static final String EMPTY_REPLY_TEXT =
		"Nie mogę pomóc w tej sprawie. Chętnie za to pomogę w wyborze sprzętu z naszego sklepu.";

	private final AssistantModel assistantModel;

	public Flux<ReplyChunk> generateReply(List<ConversationMessage> conversation, @Nullable String customerId) {
		return assistantModel.generateReply(conversation, customerId)
			.switchIfEmpty(Flux.just(new ReplyText(EMPTY_REPLY_TEXT)));
	}

}
