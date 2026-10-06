package xyz.cursedman.psk.ecommerce.catalog.api;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import xyz.cursedman.psk.ecommerce.TestcontainersConfiguration;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@AutoConfigureMockMvc
class ProductApiTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void pagesProducts() throws Exception {
		mockMvc.perform(get("/api/products").param("page", "2").param("pageSize", "5"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.total").value(14))
			.andExpect(jsonPath("$.products.length()").value(5))
			.andExpect(jsonPath("$.products[0].id").value(6))
			.andExpect(jsonPath("$.products[0].imageUrl").exists());
	}

	@Test
	void filtersAndSortsProducts() throws Exception {
		mockMvc.perform(get("/api/products")
				.param("category", "Audio")
				.param("connectivity", "USB-C")
				.param("onlyAvailable", "true")
				.param("sort", "priceDesc"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.total").value(3))
			.andExpect(jsonPath("$.products[*].name",
				contains("Bose QuietComfort Ultra", "Sony WH-1000XM5", "JBL Flip 6")));
	}

	@Test
	void searchesByNameAndPrice() throws Exception {
		mockMvc.perform(get("/api/products").param("search", "logitech mx").param("maxPrice", "500"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.products[*].name", contains("Logitech MX Master 3S", "Logitech MX Keys S")));
	}

	@Test
	void rejectsInvalidQuery() throws Exception {
		mockMvc.perform(get("/api/products").param("pageSize", "0"))
			.andExpect(status().isBadRequest());
		mockMvc.perform(get("/api/products").param("sort", "random"))
			.andExpect(status().isBadRequest());
	}

	@Test
	void returnsProductDetails() throws Exception {
		mockMvc.perform(get("/api/products/1"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.name").value("Sony WH-1000XM5"))
			.andExpect(jsonPath("$.images.length()").value(3))
			.andExpect(jsonPath("$.specifications[0].name").value("Łączność"))
			.andExpect(jsonPath("$.connectivity", contains("Bluetooth", "USB-C")));
	}

	@Test
	void returnsProblemDetailForMissingProduct() throws Exception {
		mockMvc.perform(get("/api/products/999"))
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$.status").value(404))
			.andExpect(jsonPath("$.detail").value("Product 999 not found"));
	}

	@Test
	void returnsRelatedProductsFromSameCategory() throws Exception {
		mockMvc.perform(get("/api/products/1/related"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$[*].id", not(hasItem(1))))
			.andExpect(jsonPath("$.length()").value(4));
		mockMvc.perform(get("/api/products/1/related").param("limit", "2"))
			.andExpect(jsonPath("$[*].id", contains(2, 3)));
	}

	@Test
	void returnsCategoriesAndFilterOptions() throws Exception {
		mockMvc.perform(get("/api/products/categories"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$", contains("Akcesoria", "Audio", "Komputery", "Smartfony")));
		mockMvc.perform(get("/api/products/filter-options"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.connectivityOptions", contains("Bluetooth", "USB-C", "Wi-Fi")))
			.andExpect(jsonPath("$.brands", hasItem("Logitech")));
	}

}
