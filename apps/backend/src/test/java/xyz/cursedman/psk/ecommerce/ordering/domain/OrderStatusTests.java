package xyz.cursedman.psk.ecommerce.ordering.domain;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class OrderStatusTests {

	@Test
	void pendingPaymentEndsInPaidOrFailed() {
		assertThat(OrderStatus.PENDING_PAYMENT.canTransitionTo(OrderStatus.PAID)).isTrue();
		assertThat(OrderStatus.PENDING_PAYMENT.canTransitionTo(OrderStatus.PAYMENT_FAILED)).isTrue();
		assertThat(OrderStatus.PENDING_PAYMENT.canTransitionTo(OrderStatus.PENDING_PAYMENT)).isFalse();
	}

	@Test
	void finalStatusesCannotChange() {
		for (OrderStatus next : OrderStatus.values()) {
			assertThat(OrderStatus.PAID.canTransitionTo(next)).isFalse();
			assertThat(OrderStatus.PAYMENT_FAILED.canTransitionTo(next)).isFalse();
		}
	}

}
