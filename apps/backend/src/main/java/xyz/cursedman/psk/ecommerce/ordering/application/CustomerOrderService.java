package xyz.cursedman.psk.ecommerce.ordering.application;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import xyz.cursedman.psk.ecommerce.ordering.domain.Order;
import xyz.cursedman.psk.ecommerce.ordering.domain.OrderRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerOrderService {

	private final OrderRepository orderRepository;

	public List<Order> findOrders(String customerId) {
		List<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDescIdDesc(customerId);
		orders.forEach(CustomerOrderService::initializeItems);
		return orders;
	}

	public Order getOrder(String customerId, long id) {
		Order order = orderRepository.findByIdAndCustomerId(id, customerId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
		initializeItems(order);
		return order;
	}

	private static void initializeItems(Order order) {
		order.getItems().forEach(item -> Hibernate.initialize(item.getProduct().getImages()));
	}

}
