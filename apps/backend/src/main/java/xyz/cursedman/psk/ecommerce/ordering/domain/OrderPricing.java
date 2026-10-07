package xyz.cursedman.psk.ecommerce.ordering.domain;

import java.math.BigDecimal;
import java.util.List;

import xyz.cursedman.psk.ecommerce.catalog.domain.Product;

/**
 * Prices of an order. All amounts are gross; {@code vatAmount} is the VAT included in {@code total}.
 */
public record OrderPricing(
	List<Line> lines,
	DeliveryMethod deliveryMethod,
	BigDecimal itemsTotal,
	BigDecimal total,
	BigDecimal vatAmount) {

	public record Line(Product product, int quantity, BigDecimal unitPrice, BigDecimal lineTotal) {
	}

}
