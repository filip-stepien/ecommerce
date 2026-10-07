package xyz.cursedman.psk.ecommerce.catalog.application;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import xyz.cursedman.psk.ecommerce.catalog.domain.Product;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductRepository;
import xyz.cursedman.psk.ecommerce.catalog.domain.exception.ProductNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.MANDATORY)
public class InventoryService {

	private final ProductRepository productRepository;

	/**
	 * Locks the products and takes the quantities off their stock.
	 *
	 * @param quantities quantity to reserve by product id
	 * @return the locked products, ordered by id
	 */
	public List<Product> reserve(Map<Long, Integer> quantities) {
		List<Product> products = lockProducts(quantities.keySet());
		products.forEach(product -> product.reserveStock(quantities.get(product.getId())));
		return products;
	}

	public void release(Map<Long, Integer> quantities) {
		lockProducts(quantities.keySet())
			.forEach(product -> product.releaseStock(quantities.get(product.getId())));
	}

	private List<Product> lockProducts(Set<Long> ids) {
		List<Product> products = productRepository.findAllByIdForUpdate(ids);
		if (products.size() != ids.size()) {
			Set<Long> foundIds = products.stream().map(Product::getId).collect(Collectors.toSet());
			Set<Long> missingIds = ids.stream().filter(id -> !foundIds.contains(id)).collect(Collectors.toSet());
			throw new ProductNotFoundException(missingIds);
		}
		return products;
	}

}
