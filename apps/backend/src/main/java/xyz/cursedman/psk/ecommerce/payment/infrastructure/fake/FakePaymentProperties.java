package xyz.cursedman.psk.ecommerce.payment.infrastructure.fake;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @param decline when true, every payment is declined, to exercise the failure path
 */
@ConfigurationProperties("shop.payments.fake")
public record FakePaymentProperties(boolean decline) {
}
