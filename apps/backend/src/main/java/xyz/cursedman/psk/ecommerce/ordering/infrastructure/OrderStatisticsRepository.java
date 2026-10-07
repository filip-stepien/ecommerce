package xyz.cursedman.psk.ecommerce.ordering.infrastructure;

import java.util.Collection;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import xyz.cursedman.psk.ecommerce.ordering.domain.OrderItem;
import xyz.cursedman.psk.ecommerce.ordering.domain.OrderStatus;

interface OrderStatisticsRepository extends Repository<OrderItem, Long> {

	@Query("""
		select new xyz.cursedman.psk.ecommerce.ordering.infrastructure.PurchasedProduct(
			i.product.id, i.product.category, i.product.brand, sum(i.quantity))
		from OrderItem i
		where i.order.customerId = :customerId and i.order.status = :status
		group by i.product.id, i.product.category, i.product.brand""")
	List<PurchasedProduct> findPurchasedProducts(String customerId, OrderStatus status);

	@Query("""
		select i.product.id
		from OrderItem i
		where i.order.status = :status
		group by i.product.id
		order by sum(i.quantity) desc, i.product.id""")
	List<Long> findBestsellingProductIds(OrderStatus status, Pageable pageable);

	@Query("""
		select new xyz.cursedman.psk.ecommerce.ordering.infrastructure.ProductSales(i.product.id, sum(i.quantity))
		from OrderItem i
		where i.order.status = :status and i.product.id in :productIds
		group by i.product.id""")
	List<ProductSales> findProductSales(Collection<Long> productIds, OrderStatus status);

}
