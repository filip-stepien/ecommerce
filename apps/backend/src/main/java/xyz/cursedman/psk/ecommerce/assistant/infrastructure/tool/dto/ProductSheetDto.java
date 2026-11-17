package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto;

import java.math.BigDecimal;
import java.util.List;

import org.jspecify.annotations.Nullable;

public record ProductSheetDto(
	long id,
	String name,
	@Nullable String subtitle,
	String brand,
	String category,
	BigDecimal price,
	int stock,
	@Nullable String description,
	List<String> connectivity,
	List<SpecificationEntryDto> specifications
) {
}
