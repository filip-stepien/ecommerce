package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto;

import java.util.List;

public record CatalogOverviewDto(List<String> categories, List<String> brands, List<String> connectivity) {
}
