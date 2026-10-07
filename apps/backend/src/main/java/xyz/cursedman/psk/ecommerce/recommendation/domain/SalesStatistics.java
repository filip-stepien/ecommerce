package xyz.cursedman.psk.ecommerce.recommendation.domain;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Port to sales figures from paid orders.
 */
public interface SalesStatistics {

	/** Product ids ordered by units sold, best-selling first. */
	List<Long> findBestsellingProductIds(int limit);

	/** Units sold by product id; products never sold are absent. */
	Map<Long, Long> findSoldQuantities(Collection<Long> productIds);

}
