package xyz.cursedman.psk.ecommerce.assistant.infrastructure;

import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import org.jspecify.annotations.Nullable;

import org.springframework.ai.chat.model.ToolContext;

import xyz.cursedman.psk.ecommerce.catalog.domain.Product;

public record AssistantToolContext(@Nullable String customerId, Consumer<List<Product>> productsShownListener) {

	private static final String KEY = AssistantToolContext.class.getName();

	public static AssistantToolContext from(ToolContext toolContext) {
		return (AssistantToolContext) toolContext.getContext().get(KEY);
	}

	public Map<String, Object> toMap() {
		return Map.of(KEY, this);
	}

	public void showProducts(List<Product> products) {
		productsShownListener.accept(products);
	}

}
