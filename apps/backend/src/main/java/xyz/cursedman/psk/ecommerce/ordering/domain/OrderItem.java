package xyz.cursedman.psk.ecommerce.ordering.domain;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import xyz.cursedman.psk.ecommerce.catalog.domain.Product;

@Entity
@Table(name = "order_item")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "order_id")
	private Order order;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "product_id")
	private Product product;

	/** Name at the time of the order. */
	@Column(nullable = false)
	private String productName;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal unitPrice;

	@Column(nullable = false)
	private int quantity;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal lineTotal;

	OrderItem(Order order, OrderPricing.Line line) {
		this.order = order;
		this.product = line.product();
		this.productName = line.product().getName();
		this.unitPrice = line.unitPrice();
		this.quantity = line.quantity();
		this.lineTotal = line.lineTotal();
	}

}
