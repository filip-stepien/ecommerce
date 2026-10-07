package xyz.cursedman.psk.ecommerce.ordering.application;

import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import xyz.cursedman.psk.ecommerce.catalog.application.InventoryService;
import xyz.cursedman.psk.ecommerce.catalog.domain.Product;
import xyz.cursedman.psk.ecommerce.ordering.domain.DeliveryMethod;
import xyz.cursedman.psk.ecommerce.ordering.domain.Order;
import xyz.cursedman.psk.ecommerce.ordering.domain.OrderPricing;
import xyz.cursedman.psk.ecommerce.ordering.domain.OrderPricingService;
import xyz.cursedman.psk.ecommerce.ordering.domain.OrderRepository;
import xyz.cursedman.psk.ecommerce.ordering.domain.exception.UnknownDeliveryMethodException;
import xyz.cursedman.psk.ecommerce.payment.application.PaymentProcessorRegistry;
import xyz.cursedman.psk.ecommerce.payment.domain.PaymentProcessor;
import xyz.cursedman.psk.ecommerce.payment.domain.PaymentRequest;
import xyz.cursedman.psk.ecommerce.payment.domain.PaymentResult;

/**
 * Places an order: reserves stock, prices the order, saves it and starts the payment.
 */
@Service
@RequiredArgsConstructor
public class CheckoutService {

	private final CheckoutProperties checkoutProperties;

	private final PaymentProcessorRegistry paymentProcessors;

	private final InventoryService inventoryService;

	private final OrderPricingService pricingService;

	private final OrderRepository orderRepository;

	@Transactional
	public PlaceOrderResult placeOrder(String customerId, PlaceOrderCommand command) {
		DeliveryMethod deliveryMethod = checkoutProperties.findDeliveryMethod(command.deliveryMethod())
			.orElseThrow(() -> new UnknownDeliveryMethodException(command.deliveryMethod()));
		PaymentProcessor paymentProcessor = paymentProcessors.processorFor(command.paymentMethod());

		Map<Long, Integer> quantities = command.quantitiesByProductId();
		List<Product> products = inventoryService.reserve(quantities);
		OrderPricing pricing = pricingService.price(
			products, quantities, deliveryMethod, checkoutProperties.vatRate());
		Order order = orderRepository.save(Order.place(
			customerId,
			command.contact(),
			command.deliveryAddress(),
			command.invoice(),
			command.paymentMethod(),
			pricing,
			checkoutProperties.currency()));

		PaymentResult payment = paymentProcessor.process(
			new PaymentRequest(order.getId(), order.getTotal(), order.getCurrency(), order.getPaymentMethod()));
		String clientSecret = switch (payment) {
			case PaymentResult.Succeeded succeeded -> {
				order.markPaid(succeeded.paymentId());
				yield null;
			}
			case PaymentResult.Failed failed -> {
				order.markPaymentFailed(failed.reason());
				yield null;
			}
			case PaymentResult.RequiresAction action -> {
				order.awaitPayment(action.paymentId());
				yield action.clientSecret();
			}
		};
		return new PlaceOrderResult(orderRepository.save(order), clientSecret);
	}

}
