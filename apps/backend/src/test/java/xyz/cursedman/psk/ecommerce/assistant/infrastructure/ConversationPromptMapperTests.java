package xyz.cursedman.psk.ecommerce.assistant.infrastructure;

import java.util.List;

import org.junit.jupiter.api.Test;

import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.MessageType;

import xyz.cursedman.psk.ecommerce.assistant.domain.ConversationMessage;

import static org.assertj.core.api.Assertions.assertThat;

class ConversationPromptMapperTests {

	private final ConversationPromptMapper mapper = new ConversationPromptMapper();

	@Test
	void promptStartsWithTheFirstCustomerMessage() {
		List<Message> prompt = mapper.toPromptMessages(List.of(
			ConversationMessage.fromAssistant("Cześć! W czym pomóc?", List.of()),
			ConversationMessage.fromCustomer("Szukam słuchawek")));

		assertThat(prompt).extracting(Message::getMessageType).containsExactly(MessageType.USER);
	}

	@Test
	void assistantMessageNamesTheProductsShownAsCards() {
		List<Message> prompt = mapper.toPromptMessages(List.of(
			ConversationMessage.fromCustomer("Szukam słuchawek"),
			ConversationMessage.fromAssistant("Proponuję te:", List.of(3L, 1L)),
			ConversationMessage.fromCustomer("A tańsze?")));

		assertThat(prompt).extracting(Message::getMessageType)
			.containsExactly(MessageType.USER, MessageType.ASSISTANT, MessageType.USER);
		assertThat(prompt.get(1).getText())
			.isEqualTo("Proponuję te:\n\n[Products shown to the customer as cards, ids: 3, 1]");
	}

	@Test
	void assistantMessageWithOnlyCardsKeepsTheCards() {
		List<Message> prompt = mapper.toPromptMessages(List.of(
			ConversationMessage.fromCustomer("Szukam słuchawek"),
			ConversationMessage.fromAssistant("", List.of(3L)),
			ConversationMessage.fromCustomer("Ile kosztują?")));

		assertThat(prompt.get(1).getText()).isEqualTo("[Products shown to the customer as cards, ids: 3]");
	}

	@Test
	void emptyAssistantMessagesAreSkipped() {
		List<Message> prompt = mapper.toPromptMessages(List.of(
			ConversationMessage.fromCustomer("Szukam słuchawek"),
			ConversationMessage.fromAssistant("  ", List.of()),
			ConversationMessage.fromCustomer("Halo?")));

		assertThat(prompt).extracting(Message::getMessageType).containsExactly(MessageType.USER, MessageType.USER);
	}

}
