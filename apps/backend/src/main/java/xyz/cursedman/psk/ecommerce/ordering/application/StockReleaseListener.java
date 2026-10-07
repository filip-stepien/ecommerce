package xyz.cursedman.psk.ecommerce.ordering.application;

import lombok.RequiredArgsConstructor;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import xyz.cursedman.psk.ecommerce.catalog.application.InventoryService;
import xyz.cursedman.psk.ecommerce.ordering.domain.OrderPaymentFailedEvent;

@Component
@RequiredArgsConstructor
class StockReleaseListener {

	private final InventoryService inventoryService;

	@EventListener
	void onPaymentFailed(OrderPaymentFailedEvent event) {
		inventoryService.release(event.quantities());
	}

}
