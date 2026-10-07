package xyz.cursedman.psk.ecommerce.catalog.application;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import xyz.cursedman.psk.ecommerce.catalog.domain.Product;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductFilter;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductFilterSpecifications;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductRepository;
import xyz.cursedman.psk.ecommerce.catalog.domain.exception.ProductNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

	private final ProductRepository productRepository;

	public Page<Product> findProducts(ProductFilter filter, Pageable pageable) {
		Page<Product> page = productRepository.findAll(ProductFilterSpecifications.matching(filter), pageable);
		initializeImages(page.getContent());
		return page;
	}

	public Product getProduct(long id) {
		return productRepository.findWithDetailsById(id)
			.orElseThrow(() -> new ProductNotFoundException(id));
	}

	public List<Product> findRelatedProducts(long id, int limit) {
		Product product = productRepository.findById(id)
			.orElseThrow(() -> new ProductNotFoundException(id));
		return initializeImages(productRepository.findByCategoryAndIdNot(
			product.getCategory(), id, PageRequest.of(0, limit, Sort.by("id"))));
	}

	public List<String> findCategories() {
		return productRepository.findCategories();
	}

	public List<String> findBrands() {
		return productRepository.findBrands();
	}

	public List<String> findConnectivityOptions() {
		return productRepository.findConnectivityOptions();
	}

	/**
	 * Loads the images of listed products while the session is open; batch fetching makes this a single query.
	 */
	private static List<Product> initializeImages(List<Product> products) {
		products.forEach(product -> Hibernate.initialize(product.getImages()));
		return products;
	}

}
