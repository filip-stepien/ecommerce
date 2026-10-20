package xyz.cursedman.psk.ecommerce.ordering.domain;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

	List<Order> findByCustomerIdOrderByCreatedAtDescIdDesc(String customerId);

	Optional<Order> findByIdAndCustomerId(long id, String customerId);
}
