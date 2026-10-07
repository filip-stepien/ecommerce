package xyz.cursedman.psk.ecommerce.ordering.infrastructure;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import xyz.cursedman.psk.ecommerce.ordering.domain.OrderStatus;
import xyz.cursedman.psk.ecommerce.recommendation.domain.CustomerPurchases;
import xyz.cursedman.psk.ecommerce.recommendation.domain.PurchaseHistory;
import xyz.cursedman.psk.ecommerce.recommendation.domain.SalesStatistics;

/**
 * Serves the recommendation ports from paid orders.
 */
@Component
@RequiredArgsConstructor
class OrderStatisticsAdapter implements PurchaseHistory, SalesStatistics {

	private final OrderStatisticsRepository repository;

	@Override
	public CustomerPurchases findByCustomer(String customerId) {
		List<PurchasedProduct> purchased = repository.findPurchasedProducts(customerId, OrderStatus.PAID);
		return new CustomerPurchases(
			purchased.stream().map(PurchasedProduct::productId).collect(Collectors.toUnmodifiableSet()),
			purchased.stream().collect(Collectors.groupingBy(PurchasedProduct::category,
				Collectors.summingLong(PurchasedProduct::quantity))),
			purchased.stream().collect(Collectors.groupingBy(PurchasedProduct::brand,
				Collectors.summingLong(PurchasedProduct::quantity))));
	}

	@Override
	public List<Long> findBestsellingProductIds(int limit) {
		return repository.findBestsellingProductIds(OrderStatus.PAID, PageRequest.ofSize(limit));
	}

	@Override
	public Map<Long, Long> findSoldQuantities(Collection<Long> productIds) {
		if (productIds.isEmpty()) {
			return Map.of();
		}
		return repository.findProductSales(productIds, OrderStatus.PAID).stream()
			.collect(Collectors.toMap(ProductSales::productId, ProductSales::quantity));
	}

}
