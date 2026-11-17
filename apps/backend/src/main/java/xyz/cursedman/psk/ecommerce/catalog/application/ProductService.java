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
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductFilterSpecifications;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductRepository;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductSortOrder;
import xyz.cursedman.psk.ecommerce.catalog.domain.exception.ProductNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

	private final ProductRepository productRepository;

	private static final Sort BY_ID = Sort.by("id");

	public Page<Product> findProducts(ProductQuery query) {
		Sort sort = sortOf(query.sortOrder()).and(BY_ID);
		Pageable pageable = PageRequest.of(query.pageIndex(), query.pageSize(), sort);

		Page<Product> page = productRepository.findAll(ProductFilterSpecifications.matching(query.filter()), pageable);
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
			product.getCategory(), id, PageRequest.of(0, limit, BY_ID)));
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

	private static Sort sortOf(ProductSortOrder sortOrder) {
		return switch (sortOrder) {
			case DEFAULT -> Sort.unsorted();
			case PRICE_ASC -> Sort.by("price").ascending();
			case PRICE_DESC -> Sort.by("price").descending();
			case NAME_ASC -> Sort.by("name").ascending();
		};
	}

	/**
	 * Loads the images of listed products while the session is open; batch fetching makes this a single query.
	 */
	private static List<Product> initializeImages(List<Product> products) {
		products.forEach(product -> Hibernate.initialize(product.getImages()));
		return products;
	}

}
