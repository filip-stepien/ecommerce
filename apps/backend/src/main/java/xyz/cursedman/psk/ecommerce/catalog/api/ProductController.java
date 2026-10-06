package xyz.cursedman.psk.ecommerce.catalog.api;

import java.util.List;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import xyz.cursedman.psk.ecommerce.catalog.api.dto.ProductDetailsDto;
import xyz.cursedman.psk.ecommerce.catalog.api.dto.ProductDto;
import xyz.cursedman.psk.ecommerce.catalog.api.dto.ProductFilterOptionsDto;
import xyz.cursedman.psk.ecommerce.catalog.api.dto.ProductPageDto;
import xyz.cursedman.psk.ecommerce.catalog.application.ProductService;

@RestController
@RequestMapping("/api/products")
@Tag(name = "products")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService productService;

	private final ProductMapper productMapper;

	@GetMapping
	public ProductPageDto getProducts(@Valid @ParameterObject ProductSearchParams params) {
		Pageable pageable = PageRequest.of(params.page() - 1, params.pageSize(), params.sort().getSort());
		return productMapper.toPageDto(productService.findProducts(productMapper.toFilter(params), pageable));
	}

	@GetMapping("/{id:\\d+}")
	public ProductDetailsDto getProduct(@PathVariable long id) {
		return productMapper.toDetailsDto(productService.getProduct(id));
	}

	@GetMapping("/{id:\\d+}/related")
	public List<ProductDto> getRelatedProducts(
			@PathVariable long id,
			@Parameter(description = "Maximum number of products") @RequestParam(defaultValue = "6") @Min(1) @Max(24)
			int limit) {
		return productMapper.toDtos(productService.findRelatedProducts(id, limit));
	}

	@GetMapping("/categories")
	public List<String> getProductCategories() {
		return productService.findCategories();
	}

	@GetMapping("/filter-options")
	public ProductFilterOptionsDto getProductFilterOptions() {
		return new ProductFilterOptionsDto(productService.findConnectivityOptions(), productService.findBrands());
	}

}
