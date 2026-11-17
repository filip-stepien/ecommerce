package xyz.cursedman.psk.ecommerce.assistant.infrastructure;

import java.util.List;

import com.anthropic.models.messages.OutputConfig;
import org.jspecify.annotations.Nullable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import org.springframework.ai.anthropic.AnthropicCacheOptions;
import org.springframework.ai.anthropic.AnthropicCacheStrategy;
import org.springframework.ai.anthropic.AnthropicChatOptions;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import xyz.cursedman.psk.ecommerce.assistant.domain.AssistantModel;
import xyz.cursedman.psk.ecommerce.assistant.domain.ConversationMessage;
import xyz.cursedman.psk.ecommerce.assistant.domain.ProductsShown;
import xyz.cursedman.psk.ecommerce.assistant.domain.ReplyChunk;
import xyz.cursedman.psk.ecommerce.assistant.domain.ReplyText;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.CatalogTools;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.ProductCardTools;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.PurchaseTools;

@Component
class SpringAiAssistantModel implements AssistantModel {

	private final ChatClient chatClient;

	private final ConversationPromptMapper promptMapper;

	SpringAiAssistantModel(
		ChatClient.Builder chatClientBuilder,
		ConversationPromptMapper promptMapper,
		CatalogTools catalogTools,
		PurchaseTools purchaseTools,
		ProductCardTools productCardTools,
		@Value("classpath:assistant/system-prompt.md") Resource systemPrompt
	) {
		AnthropicCacheOptions cacheOptions = AnthropicCacheOptions.builder()
			.strategy(AnthropicCacheStrategy.CONVERSATION_HISTORY)
			.build();
		AnthropicChatOptions.Builder chatOptions = AnthropicChatOptions.builder()
			.effort(OutputConfig.Effort.LOW)
			.cacheOptions(cacheOptions);

		this.promptMapper = promptMapper;
		this.chatClient = chatClientBuilder
			.defaultSystem(systemPrompt)
			.defaultTools(catalogTools, purchaseTools, productCardTools)
			.defaultOptions(chatOptions)
			.build();
	}

	@Override
	public Flux<ReplyChunk> generateReply(List<ConversationMessage> conversation, @Nullable String customerId) {
		Sinks.Many<ReplyChunk> shownProducts = Sinks.many().unicast().onBackpressureBuffer();
		AssistantToolContext toolContext = new AssistantToolContext(
			customerId,
			products -> shownProducts.tryEmitNext(new ProductsShown(products))
		);

		Flux<ReplyChunk> replyText = Flux
			.defer(() -> chatClient.prompt()
				.messages(promptMapper.toPromptMessages(conversation))
				.toolContext(toolContext.toMap())
				.stream()
				.content())
			.filter(text -> !text.isEmpty())
			.<ReplyChunk>map(ReplyText::new)
			.doFinally(signal -> shownProducts.tryEmitComplete());

		return Flux.merge(replyText, shownProducts.asFlux());
	}

}
