package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto;

import java.util.List;

public record ShownProductsDto(List<Long> shownIds, List<Long> notFoundIds) {
}
