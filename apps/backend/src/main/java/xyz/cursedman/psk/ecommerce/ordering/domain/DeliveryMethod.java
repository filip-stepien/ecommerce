package xyz.cursedman.psk.ecommerce.ordering.domain;

import java.math.BigDecimal;

public record DeliveryMethod(String id, String name, BigDecimal price) {
}
