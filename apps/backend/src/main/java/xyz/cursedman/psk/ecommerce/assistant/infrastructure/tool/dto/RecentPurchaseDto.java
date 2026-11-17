package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto;

import java.time.Instant;

public record RecentPurchaseDto(long productId, String productName, int quantity, Instant orderedAt) {
}
