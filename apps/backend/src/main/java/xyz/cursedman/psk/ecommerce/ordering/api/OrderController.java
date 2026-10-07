package xyz.cursedman.psk.ecommerce.ordering.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import xyz.cursedman.psk.ecommerce.config.OpenApiConfig;
import xyz.cursedman.psk.ecommerce.ordering.api.dto.PlaceOrderRequestDto;
import xyz.cursedman.psk.ecommerce.ordering.api.dto.PlaceOrderResponseDto;
import xyz.cursedman.psk.ecommerce.ordering.application.CheckoutService;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "orders")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
@SecurityRequirement(name = OpenApiConfig.KEYCLOAK_AUTH)
@RequiredArgsConstructor
public class OrderController {

	private final CheckoutService checkoutService;

	private final OrderMapper orderMapper;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Place an order and start its payment",
		description = "Prices come from the catalog, not from the client. "
			+ "A declined payment still creates the order, with status PAYMENT_FAILED.")
	public PlaceOrderResponseDto placeOrder(
			@AuthenticationPrincipal Jwt jwt,
			@Valid @RequestBody PlaceOrderRequestDto request) {
		return orderMapper.toResponse(checkoutService.placeOrder(jwt.getSubject(), orderMapper.toCommand(request)));
	}

}
