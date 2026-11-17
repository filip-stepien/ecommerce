package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.CatalogOverviewDto;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.FoundProductDto;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.PriceOrderDto;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.ProductSheetDto;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.ProductSheetsDto;
import xyz.cursedman.psk.ecommerce.catalog.application.ProductQuery;
import xyz.cursedman.psk.ecommerce.catalog.application.ProductService;
import xyz.cursedman.psk.ecommerce.catalog.domain.Product;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductFilter;
import xyz.cursedman.psk.ecommerce.catalog.domain.exception.ProductNotFoundException;

@Component
@RequiredArgsConstructor
public class CatalogTools {

	static final int SEARCH_LIMIT = 10;

	static final int PRODUCT_SHEETS_LIMIT = 5;

	private final ProductService productService;

	private final AssistantToolMapper toolMapper;

	@Tool(
		name = "search_products",
		description = """
			Searches the shop catalog and returns at most 10 products with their current gross prices in PLN \
			and stock. Call it before you recommend or name any product, and again whenever the customer changes \
			their requirements (budget, brand, use). The phrase matches a fragment of the product name only, \
			so pass a short phrase that appears in product names (a model, a series, a brand) or leave it empty \
			and filter by category. Out-of-stock products are skipped unless includeOutOfStock is true."""
	)
	public List<FoundProductDto> searchProducts(
		@ToolParam(required = false, description = "Fragment of the product name, e.g. WH-1000 or MacBook")
		@Nullable String phrase,
		@ToolParam(required = false, description = "Exact category name as returned by list_catalog")
		@Nullable String category,
		@ToolParam(required = false, description = "Exact brand name as returned by list_catalog")
		@Nullable String brand,
		@ToolParam(required = false, description = "Minimum gross price in PLN")
		@Nullable BigDecimal minPrice,
		@ToolParam(required = false, description = "Maximum gross price in PLN")
		@Nullable BigDecimal maxPrice,
		@ToolParam(required = false, description = "Order of the results by price, NONE by default")
		@Nullable PriceOrderDto priceOrder,
		@ToolParam(required = false, description = "Also return products that are out of stock, false by default")
		@Nullable Boolean includeOutOfStock
	) {
		boolean onlyAvailable = !Boolean.TRUE.equals(includeOutOfStock);
		ProductFilter filter = new ProductFilter(phrase, category, brand, null, minPrice, maxPrice, onlyAvailable);
		ProductQuery firstPage = new ProductQuery(filter, toolMapper.toSortOrder(priceOrder), 0, SEARCH_LIMIT);

		List<Product> found = productService.findProducts(firstPage).getContent();

		return toolMapper.toFoundProducts(found);
	}

	@Tool(
		name = "get_product_details",
		description = """
			Returns the description, specification, connectivity, current gross price in PLN and stock of up to 5 \
			products. Call it before you compare products, explain why a product fits, or answer a question about \
			its parameters."""
	)
	public ProductSheetsDto getProductDetails(
		@ToolParam(description = "Ids of the products, at most 5") List<Long> productIds
	) {
		List<ProductSheetDto> sheets = new ArrayList<>();
		List<Long> notFoundIds = new ArrayList<>();
		List<Long> requestedIds = productIds.stream()
			.filter(Objects::nonNull)
			.distinct()
			.limit(PRODUCT_SHEETS_LIMIT)
			.toList();

		for (Long id : requestedIds) {
			try {
				sheets.add(toolMapper.toProductSheet(productService.getProduct(id)));
			}
			catch (ProductNotFoundException exception) {
				notFoundIds.add(id);
			}
		}

		return new ProductSheetsDto(sheets, notFoundIds);
	}

	@Tool(
		name = "list_catalog",
		description = """
			Returns the category names, brand names and connectivity options used in the shop. Call it when you \
			need an exact category or brand name for search_products."""
	)
	public CatalogOverviewDto listCatalog() {
		return new CatalogOverviewDto(
			productService.findCategories(),
			productService.findBrands(),
			productService.findConnectivityOptions()
		);
	}

}
