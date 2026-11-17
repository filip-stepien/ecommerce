package xyz.cursedman.psk.ecommerce.assistant.domain;

import java.util.List;

import org.jspecify.annotations.Nullable;
import reactor.core.publisher.Flux;

public interface AssistantModel {

	Flux<ReplyChunk> generateReply(List<ConversationMessage> conversation, @Nullable String customerId);

}
