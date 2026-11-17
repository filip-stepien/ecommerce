package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool;

import java.util.List;
import java.util.Objects;

import lombok.RequiredArgsConstructor;

import org.springframework.ai.chat.model.ToolContext;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import xyz.cursedman.psk.ecommerce.assistant.infrastructure.AssistantToolContext;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.ShownProductsDto;
import xyz.cursedman.psk.ecommerce.catalog.application.ProductService;
import xyz.cursedman.psk.ecommerce.catalog.domain.Product;

@Component
@RequiredArgsConstructor
public class ProductCardTools {

	static final int SHOWN_PRODUCTS_LIMIT = 6;

	private final ProductService productService;

	@Tool(
		name = "show_products",
		description = """
			Shows up to 6 products to the customer as cards with an image, the current price and an Add to cart \
			button, below your message. Call it whenever you propose specific products, in the order you mention \
			them."""
	)
	public ShownProductsDto showProducts(
		@ToolParam(description = "Ids of the products to show, at most 6") List<Long> productIds,
		ToolContext toolContext
	) {
		List<Long> requestedIds = productIds.stream()
			.filter(Objects::nonNull)
			.distinct()
			.limit(SHOWN_PRODUCTS_LIMIT)
			.toList();
		List<Product> products = productService.findProductsInOrder(requestedIds);

		if (!products.isEmpty()) {
			AssistantToolContext.from(toolContext).showProducts(products);
		}

		List<Long> shownIds = products.stream().map(Product::getId).toList();
		List<Long> notFoundIds = requestedIds.stream().filter(id -> !shownIds.contains(id)).toList();

		return new ShownProductsDto(shownIds, notFoundIds);
	}

}
