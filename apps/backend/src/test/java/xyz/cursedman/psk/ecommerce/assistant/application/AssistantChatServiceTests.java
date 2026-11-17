package xyz.cursedman.psk.ecommerce.assistant.application;

import java.util.List;

import org.junit.jupiter.api.Test;
import reactor.core.publisher.Flux;

import xyz.cursedman.psk.ecommerce.assistant.domain.AssistantModel;
import xyz.cursedman.psk.ecommerce.assistant.domain.ConversationMessage;
import xyz.cursedman.psk.ecommerce.assistant.domain.ReplyChunk;
import xyz.cursedman.psk.ecommerce.assistant.domain.ReplyText;

import static org.assertj.core.api.Assertions.assertThat;

class AssistantChatServiceTests {

	private static final List<ConversationMessage> CONVERSATION =
		List.of(ConversationMessage.fromCustomer("Szukam słuchawek"));

	@Test
	void modelReplyIsPassedThrough() {
		AssistantModel model = (conversation, customerId) -> Flux.just(new ReplyText("Polecam "), new ReplyText("JBL."));

		List<ReplyChunk> reply = collectReply(new AssistantChatService(model), "alice");

		assertThat(reply).containsExactly(new ReplyText("Polecam "), new ReplyText("JBL."));
	}

	@Test
	void modelReceivesConversationAndCustomer() {
		RecordingModel model = new RecordingModel();

		collectReply(new AssistantChatService(model), "alice");

		assertThat(model.conversation).isEqualTo(CONVERSATION);
		assertThat(model.customerId).isEqualTo("alice");
	}

	@Test
	void emptyModelReplyIsReplacedWithExplanation() {
		AssistantModel model = (conversation, customerId) -> Flux.empty();

		List<ReplyChunk> reply = collectReply(new AssistantChatService(model), null);

		assertThat(reply).containsExactly(new ReplyText(AssistantChatService.EMPTY_REPLY_TEXT));
	}

	private static List<ReplyChunk> collectReply(AssistantChatService service, String customerId) {
		return service.generateReply(CONVERSATION, customerId).collectList().block();
	}

	private static final class RecordingModel implements AssistantModel {

		private List<ConversationMessage> conversation;

		private String customerId;

		@Override
		public Flux<ReplyChunk> generateReply(List<ConversationMessage> conversation, String customerId) {
			this.conversation = conversation;
			this.customerId = customerId;
			return Flux.just(new ReplyText("Cześć"));
		}

	}

}
