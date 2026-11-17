package xyz.cursedman.psk.ecommerce.assistant.domain;

import java.util.List;

public record ConversationMessage(ConversationRole role, String text, List<Long> shownProductIds) {

	public ConversationMessage {
		shownProductIds = shownProductIds != null ? List.copyOf(shownProductIds) : List.of();
	}

	public static ConversationMessage fromCustomer(String text) {
		return new ConversationMessage(ConversationRole.CUSTOMER, text, List.of());
	}

	public static ConversationMessage fromAssistant(String text, List<Long> shownProductIds) {
		return new ConversationMessage(ConversationRole.ASSISTANT, text, shownProductIds);
	}

}
