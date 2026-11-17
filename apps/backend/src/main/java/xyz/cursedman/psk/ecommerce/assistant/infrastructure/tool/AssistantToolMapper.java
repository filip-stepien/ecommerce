package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool;

import java.time.Instant;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ValueMapping;

import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.FoundProductDto;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.PriceOrderDto;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.ProductSheetDto;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.RecentPurchaseDto;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.SpecificationEntryDto;
import xyz.cursedman.psk.ecommerce.catalog.domain.Product;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductSortOrder;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductSpecification;
import xyz.cursedman.psk.ecommerce.config.MapStructConfig;
import xyz.cursedman.psk.ecommerce.ordering.domain.OrderItem;

@Mapper(config = MapStructConfig.class)
interface AssistantToolMapper {

	FoundProductDto toFoundProduct(Product product);

	List<FoundProductDto> toFoundProducts(List<Product> products);

	ProductSheetDto toProductSheet(Product product);

	SpecificationEntryDto toSpecificationEntry(ProductSpecification specification);

	@ValueMapping(target = "DEFAULT", source = MappingConstants.NULL)
	@ValueMapping(target = "DEFAULT", source = "NONE")
	@ValueMapping(target = "PRICE_ASC", source = "CHEAPEST_FIRST")
	@ValueMapping(target = "PRICE_DESC", source = "MOST_EXPENSIVE_FIRST")
	ProductSortOrder toSortOrder(@Nullable PriceOrderDto priceOrder);

	@Mapping(target = "productId", source = "item.product.id")
	@Mapping(target = "productName", source = "item.productName")
	@Mapping(target = "quantity", source = "item.quantity")
	RecentPurchaseDto toRecentPurchase(OrderItem item, Instant orderedAt);

}
