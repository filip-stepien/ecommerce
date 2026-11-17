package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import xyz.cursedman.psk.ecommerce.TestcontainersConfiguration;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.FoundProductDto;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.PriceOrderDto;
import xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto.ProductSheetsDto;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
class CatalogToolsTests {

	@Autowired
	private CatalogTools catalogTools;

	@Test
	void searchByCategoryReturnsAvailableProductsCheapestFirst() {
		List<FoundProductDto> headphones = catalogTools.searchProducts(null, "Słuchawki", null, null, null,
			PriceOrderDto.CHEAPEST_FIRST, null);

		assertThat(headphones).hasSize(CatalogTools.SEARCH_LIMIT);
		assertThat(headphones.getFirst().name()).isEqualTo("JBL Tune 520BT");
		assertThat(headphones).isSortedAccordingTo(Comparator.comparing(FoundProductDto::price));
		assertThat(headphones).allSatisfy(product -> assertThat(product.stock()).isPositive());
	}

	@Test
	void searchByPriceRangeReturnsOnlyProductsWithinBudget() {
		List<FoundProductDto> headphones = catalogTools.searchProducts(null, "Słuchawki", null,
			new BigDecimal("400"), new BigDecimal("700"), PriceOrderDto.MOST_EXPENSIVE_FIRST, null);

		assertThat(headphones).extracting(FoundProductDto::name)
			.containsExactly("JBL Live 770NC", "HyperX Cloud III");
	}

	@Test
	void outOfStockProductIsFoundOnlyWhenRequested() {
		assertThat(catalogTools.searchProducts("Galaxy Buds", null, null, null, null, null, null)).isEmpty();
		assertThat(catalogTools.searchProducts("Galaxy Buds", null, null, null, null, null, true))
			.extracting(FoundProductDto::name)
			.containsExactly("Samsung Galaxy Buds3");
	}

	@Test
	void productDetailsReportUnknownIds() {
		ProductSheetsDto details = catalogTools.getProductDetails(List.of(1L, 999L));

		assertThat(details.products()).singleElement().satisfies(sheet -> {
			assertThat(sheet.name()).isEqualTo("Sony WH-1000XM5");
			assertThat(sheet.connectivity()).contains("Bluetooth");
			assertThat(sheet.specifications()).isNotEmpty();
		});
		assertThat(details.notFoundIds()).containsExactly(999L);
	}

	@Test
	void productDetailsAreLimitedAndDeduplicated() {
		ProductSheetsDto details = catalogTools.getProductDetails(List.of(1L, 1L, 2L, 3L, 5L, 6L, 7L));

		assertThat(details.products()).extracting(sheet -> sheet.id()).containsExactly(1L, 2L, 3L, 5L, 6L);
	}

	@Test
	void catalogOverviewListsCategoriesAndBrands() {
		assertThat(catalogTools.listCatalog().categories()).contains("Słuchawki", "Laptopy");
		assertThat(catalogTools.listCatalog().brands()).contains("Sony", "JBL");
	}

}
