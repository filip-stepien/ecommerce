package xyz.cursedman.psk.ecommerce.ordering.application;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import xyz.cursedman.psk.ecommerce.ordering.domain.Address;
import xyz.cursedman.psk.ecommerce.ordering.domain.ContactDetails;
import xyz.cursedman.psk.ecommerce.ordering.domain.InvoiceDetails;
import xyz.cursedman.psk.ecommerce.payment.domain.PaymentMethod;

/**
 * @param invoice {@code null} when the invoice goes to the contact person at the delivery address
 */
public record PlaceOrderCommand(
	List<Line> items,
	ContactDetails contact,
	Address deliveryAddress,
	InvoiceDetails invoice,
	String deliveryMethod,
	PaymentMethod paymentMethod) {

	/** Quantities by product id, with repeated products merged. */
	public Map<Long, Integer> quantitiesByProductId() {
		Map<Long, Integer> quantities = new TreeMap<>();
		items.forEach(item -> quantities.merge(item.productId(), item.quantity(), Integer::sum));
		return quantities;
	}

	public record Line(long productId, int quantity) {
	}

}
