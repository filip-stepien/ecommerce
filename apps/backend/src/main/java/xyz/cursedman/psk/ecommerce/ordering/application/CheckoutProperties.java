package xyz.cursedman.psk.ecommerce.ordering.application;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import xyz.cursedman.psk.ecommerce.ordering.domain.DeliveryMethod;

/**
 * @param vatRate VAT rate included in all prices, e.g. {@code 0.23}
 */
@Validated
@ConfigurationProperties("shop.checkout")
public record CheckoutProperties(
	@NotBlank String currency,
	@NotNull @PositiveOrZero BigDecimal vatRate,
	@NotEmpty List<DeliveryMethod> deliveryMethods) {

	public Optional<DeliveryMethod> findDeliveryMethod(String id) {
		return deliveryMethods.stream().filter(method -> method.id().equals(id)).findFirst();
	}

}
