package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto;

import java.math.BigDecimal;

public record FoundProductDto(long id, String name, String brand, String category, BigDecimal price, int stock) {
}
