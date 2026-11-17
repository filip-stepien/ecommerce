package xyz.cursedman.psk.ecommerce.ordering.api;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import xyz.cursedman.psk.ecommerce.config.CurrentUserId;
import xyz.cursedman.psk.ecommerce.config.OpenApiConfig;
import xyz.cursedman.psk.ecommerce.ordering.api.dto.PlaceOrderRequestDto;
import xyz.cursedman.psk.ecommerce.ordering.api.dto.PlaceOrderResponseDto;
import xyz.cursedman.psk.ecommerce.ordering.application.CheckoutService;
import xyz.cursedman.psk.ecommerce.ordering.application.CustomerOrderService;
import xyz.cursedman.psk.ecommerce.ordering.api.dto.CustomerOrderDto;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "orders")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
@SecurityRequirement(name = OpenApiConfig.KEYCLOAK_AUTH)
@RequiredArgsConstructor
public class OrderController {

	private final CheckoutService checkoutService;

	private final OrderMapper orderMapper;

	private final CustomerOrderService customerOrderService;

	@GetMapping
	@Operation(summary = "List the authenticated customer's orders, newest first")
	public List<CustomerOrderDto> getCustomerOrders(@CurrentUserId String customerId) {
		return customerOrderService.findOrders(customerId).stream().map(orderMapper::toCustomerOrder).toList();
	}

	@GetMapping("/{id:\\d+}")
	@Operation(summary = "Get an order belonging to the authenticated customer")
	public CustomerOrderDto getCustomerOrder(@CurrentUserId String customerId, @PathVariable long id) {
		return orderMapper.toCustomerOrder(customerOrderService.getOrder(customerId, id));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Place an order and start its payment",
		description = "Prices come from the catalog, not from the client. "
			+ "A declined payment still creates the order, with status PAYMENT_FAILED.")
	public PlaceOrderResponseDto placeOrder(
		@CurrentUserId String customerId,
		@Valid @RequestBody PlaceOrderRequestDto request
	) {
		return orderMapper.toResponse(checkoutService.placeOrder(customerId, orderMapper.toCommand(request)));
	}

}
