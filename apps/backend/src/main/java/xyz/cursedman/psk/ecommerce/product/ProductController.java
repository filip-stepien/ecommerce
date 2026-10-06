package xyz.cursedman.psk.ecommerce.product;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@Tag(name = "products")
public class ProductController {

	private final ProductRepository productRepository;

	public ProductController(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}

	@GetMapping
	public List<ProductDto> getProducts() {
		return productRepository.findAll(Sort.by("id")).stream()
			.map(product -> new ProductDto(product.getId(), product.getName(), product.getPrice()))
			.toList();
	}

}
