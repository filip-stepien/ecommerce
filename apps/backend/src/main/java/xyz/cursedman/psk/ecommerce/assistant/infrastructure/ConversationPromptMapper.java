package xyz.cursedman.psk.ecommerce.assistant.infrastructure;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Component;

import xyz.cursedman.psk.ecommerce.assistant.domain.ConversationMessage;
import xyz.cursedman.psk.ecommerce.assistant.domain.ConversationRole;

@Component
class ConversationPromptMapper {

	List<Message> toPromptMessages(List<ConversationMessage> conversation) {
		List<Message> promptMessages = new ArrayList<>();

		for (ConversationMessage message : conversation) {
			boolean conversationStarted = !promptMessages.isEmpty();

			if (message.role() == ConversationRole.CUSTOMER) {
				promptMessages.add(new UserMessage(message.text()));
			}
			else if (conversationStarted && hasContent(message)) {
				promptMessages.add(new AssistantMessage(assistantText(message)));
			}
		}

		return promptMessages;
	}

	private static boolean hasContent(ConversationMessage message) {
		return !message.text().isBlank() || !message.shownProductIds().isEmpty();
	}

	private static String assistantText(ConversationMessage message) {
		String text = message.text().strip();

		if (message.shownProductIds().isEmpty()) {
			return text;
		}

		String shownIds = message.shownProductIds().stream()
			.map(String::valueOf)
			.collect(Collectors.joining(", "));
		String shownProductsNote = "[Products shown to the customer as cards, ids: " + shownIds + "]";

		return (text + "\n\n" + shownProductsNote).strip();
	}

}
