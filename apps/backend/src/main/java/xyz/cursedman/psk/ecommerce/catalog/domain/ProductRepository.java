package xyz.cursedman.psk.ecommerce.catalog.domain;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

	@EntityGraph(attributePaths = {"connectivity", "images", "specifications"})
	Optional<Product> findWithDetailsById(Long id);

	List<Product> findByCategoryAndIdNot(String category, Long id, Pageable pageable);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("select p from Product p where p.id in :ids order by p.id")
	List<Product> findAllByIdForUpdate(Collection<Long> ids);

	@Query("select distinct p.category from Product p order by p.category")
	List<String> findCategories();

	@Query("select distinct p.brand from Product p order by p.brand")
	List<String> findBrands();

	@Query("select distinct c from Product p join p.connectivity c order by c")
	List<String> findConnectivityOptions();

}
