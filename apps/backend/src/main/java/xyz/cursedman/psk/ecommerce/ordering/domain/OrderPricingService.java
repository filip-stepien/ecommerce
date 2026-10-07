package xyz.cursedman.psk.ecommerce.ordering.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import xyz.cursedman.psk.ecommerce.catalog.domain.Product;

/**
 * Prices an order from current product prices, never from prices sent by the client.
 */
@Service
public class OrderPricingService {

	/**
	 * @param vatRate VAT rate included in all prices, e.g. {@code 0.23}
	 */
	public OrderPricing price(
			List<Product> products,
			Map<Long, Integer> quantities,
			DeliveryMethod deliveryMethod,
			BigDecimal vatRate) {
		List<OrderPricing.Line> lines = products.stream()
			.map(product -> line(product, quantities.get(product.getId())))
			.toList();
		BigDecimal itemsTotal = lines.stream()
			.map(OrderPricing.Line::lineTotal)
			.reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal total = itemsTotal.add(deliveryMethod.price());
		return new OrderPricing(lines, deliveryMethod, itemsTotal, total, includedVat(total, vatRate));
	}

	private static OrderPricing.Line line(Product product, int quantity) {
		BigDecimal unitPrice = product.getPrice();
		return new OrderPricing.Line(product, quantity, unitPrice, unitPrice.multiply(BigDecimal.valueOf(quantity)));
	}

	private static BigDecimal includedVat(BigDecimal gross, BigDecimal vatRate) {
		return gross.multiply(vatRate).divide(BigDecimal.ONE.add(vatRate), 2, RoundingMode.HALF_UP);
	}

}
