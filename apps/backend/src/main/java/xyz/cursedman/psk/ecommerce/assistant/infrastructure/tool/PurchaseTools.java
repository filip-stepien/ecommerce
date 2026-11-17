package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool;

import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.ai.chat.model.ToolContext;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import xyz.cursedman.psk.ecommerce.assistant.infrastructure.AssistantToolContext;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.RecentPurchaseDto;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.RecentPurchasesDto;
import xyz.cursedman.psk.ecommerce.ordering.application.CustomerOrderService;
import xyz.cursedman.psk.ecommerce.ordering.domain.Order;
import xyz.cursedman.psk.ecommerce.ordering.domain.OrderStatus;

@Component
@RequiredArgsConstructor
public class PurchaseTools {

	static final int RECENT_ORDERS_LIMIT = 5;

	private final CustomerOrderService customerOrderService;

	private final AssistantToolMapper toolMapper;

	@Tool(
		name = "get_recent_purchases",
		description = """
			Returns the products the signed-in customer bought in their latest paid orders. Call it before you \
			recommend products, so you do not propose something the customer already has. Returns \
			customerSignedIn=false for a guest."""
	)
	public RecentPurchasesDto getRecentPurchases(ToolContext toolContext) {
		String customerId = AssistantToolContext.from(toolContext).customerId();

		if (customerId == null) {
			return RecentPurchasesDto.forGuest();
		}

		List<Order> recentPaidOrders = customerOrderService.findOrders(customerId).stream()
			.filter(order -> order.getStatus() == OrderStatus.PAID)
			.limit(RECENT_ORDERS_LIMIT)
			.toList();
		List<RecentPurchaseDto> purchases = recentPaidOrders.stream()
			.flatMap(order -> order.getItems().stream()
				.map(item -> toolMapper.toRecentPurchase(item, order.getCreatedAt())))
			.toList();

		return new RecentPurchasesDto(true, purchases);
	}

}
