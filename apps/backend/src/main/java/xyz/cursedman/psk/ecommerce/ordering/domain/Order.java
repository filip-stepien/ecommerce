package xyz.cursedman.psk.ecommerce.ordering.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import org.springframework.data.domain.AbstractAggregateRoot;

import xyz.cursedman.psk.ecommerce.payment.domain.PaymentMethod;

@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order extends AbstractAggregateRoot<Order> {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/** Keycloak user id ({@code sub} claim). */
	@Column(nullable = false)
	private String customerId;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private OrderStatus status;

	@Embedded
	private ContactDetails contact;

	@Embedded
	private Address deliveryAddress;

	/** {@code null} when the invoice goes to the contact person at the delivery address. */
	@Embedded
	@AttributeOverride(name = "name", column = @Column(name = "invoice_name"))
	@AttributeOverride(name = "taxId", column = @Column(name = "invoice_tax_id"))
	@AttributeOverride(name = "address.street", column = @Column(name = "invoice_street"))
	@AttributeOverride(name = "address.houseNumber", column = @Column(name = "invoice_house_number"))
	@AttributeOverride(name = "address.postalCode", column = @Column(name = "invoice_postal_code"))
	@AttributeOverride(name = "address.city", column = @Column(name = "invoice_city"))
	@AttributeOverride(name = "address.country", column = @Column(name = "invoice_country"))
	private InvoiceDetails invoice;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderItem> items = new ArrayList<>();

	@Column(nullable = false)
	private String deliveryMethod;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal deliveryPrice;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentMethod paymentMethod;

	/** Payment id assigned by the payment provider. */
	private String paymentId;

	private String paymentFailureReason;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal itemsTotal;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal total;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal vatAmount;

	@Column(nullable = false, length = 3)
	private String currency;

	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private Instant createdAt;

	/**
	 * @param invoice {@code null} when the invoice goes to the contact person at the delivery address
	 */
	public static Order place(
			String customerId,
			ContactDetails contact,
			Address deliveryAddress,
			InvoiceDetails invoice,
			PaymentMethod paymentMethod,
			OrderPricing pricing,
			String currency) {
		Order order = new Order();
		order.customerId = customerId;
		order.status = OrderStatus.PENDING_PAYMENT;
		order.contact = contact;
		order.deliveryAddress = deliveryAddress;
		order.invoice = invoice;
		order.deliveryMethod = pricing.deliveryMethod().id();
		order.deliveryPrice = pricing.deliveryMethod().price();
		order.paymentMethod = paymentMethod;
		order.itemsTotal = pricing.itemsTotal();
		order.total = pricing.total();
		order.vatAmount = pricing.vatAmount();
		order.currency = currency;
		pricing.lines().forEach(line -> order.items.add(new OrderItem(order, line)));
		return order;
	}

	/** Records the provider's payment id while the payment is still being settled. */
	public void awaitPayment(String paymentId) {
		requireStatus(OrderStatus.PENDING_PAYMENT);
		this.paymentId = paymentId;
	}

	public void markPaid(String paymentId) {
		transitionTo(OrderStatus.PAID);
		this.paymentId = paymentId;
	}

	public void markPaymentFailed(String reason) {
		transitionTo(OrderStatus.PAYMENT_FAILED);
		this.paymentFailureReason = reason;
		registerEvent(new OrderPaymentFailedEvent(id, quantitiesByProductId()));
	}

	private Map<Long, Integer> quantitiesByProductId() {
		return items.stream().collect(Collectors.toMap(item -> item.getProduct().getId(), OrderItem::getQuantity));
	}

	private void transitionTo(OrderStatus next) {
		if (!status.canTransitionTo(next)) {
			throw new IllegalStateException("Order %d cannot go from %s to %s".formatted(id, status, next));
		}
		status = next;
	}

	private void requireStatus(OrderStatus expected) {
		if (status != expected) {
			throw new IllegalStateException("Order %d is %s, expected %s".formatted(id, status, expected));
		}
	}

}
