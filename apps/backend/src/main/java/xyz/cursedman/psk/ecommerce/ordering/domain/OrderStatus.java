package xyz.cursedman.psk.ecommerce.ordering.domain;

public enum OrderStatus {

	PENDING_PAYMENT,
	PAID,
	PAYMENT_FAILED;

	public boolean canTransitionTo(OrderStatus next) {
		return switch (this) {
			case PENDING_PAYMENT -> next == PAID || next == PAYMENT_FAILED;
			case PAID, PAYMENT_FAILED -> false;
		};
	}

}
