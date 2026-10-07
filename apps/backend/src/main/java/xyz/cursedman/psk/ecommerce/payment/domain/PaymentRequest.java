package xyz.cursedman.psk.ecommerce.payment.domain;

import java.math.BigDecimal;

public record PaymentRequest(long orderId, BigDecimal amount, String currency, PaymentMethod method) {
}
