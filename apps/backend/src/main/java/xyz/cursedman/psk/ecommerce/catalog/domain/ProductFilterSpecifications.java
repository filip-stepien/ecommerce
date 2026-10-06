package xyz.cursedman.psk.ecommerce.catalog.domain;

import java.math.BigDecimal;
import java.util.Locale;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class ProductFilterSpecifications {

	private ProductFilterSpecifications() {
	}

	public static Specification<Product> matching(ProductFilter filter) {
		return Specification.allOf(
			nameContains(filter.search()),
			hasCategory(filter.category()),
			hasBrand(filter.brand()),
			hasConnectivity(filter.connectivity()),
			priceAtLeast(filter.minPrice()),
			priceAtMost(filter.maxPrice()),
			filter.onlyAvailable() ? inStock() : unrestricted());
	}

	private static Specification<Product> nameContains(String search) {
		if (!StringUtils.hasText(search)) {
			return unrestricted();
		}
		String pattern = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
		return (root, query, cb) -> cb.like(cb.lower(root.get("name")), pattern);
	}

	private static Specification<Product> hasCategory(String category) {
		return StringUtils.hasText(category)
			? (root, query, cb) -> cb.equal(root.get("category"), category)
			: unrestricted();
	}

	private static Specification<Product> hasBrand(String brand) {
		return StringUtils.hasText(brand)
			? (root, query, cb) -> cb.equal(root.get("brand"), brand)
			: unrestricted();
	}

	private static Specification<Product> hasConnectivity(String connectivity) {
		return StringUtils.hasText(connectivity)
			? (root, query, cb) -> cb.isMember(connectivity, root.get("connectivity"))
			: unrestricted();
	}

	private static Specification<Product> priceAtLeast(BigDecimal minPrice) {
		return minPrice != null
			? (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice)
			: unrestricted();
	}

	private static Specification<Product> priceAtMost(BigDecimal maxPrice) {
		return maxPrice != null
			? (root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice)
			: unrestricted();
	}

	private static Specification<Product> inStock() {
		return (root, query, cb) -> cb.greaterThan(root.get("stock"), 0);
	}

	private static Specification<Product> unrestricted() {
		return Specification.unrestricted();
	}

}
