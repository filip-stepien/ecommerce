package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto;

import java.util.List;

public record ProductSheetsDto(List<ProductSheetDto> products, List<Long> notFoundIds) {
}
