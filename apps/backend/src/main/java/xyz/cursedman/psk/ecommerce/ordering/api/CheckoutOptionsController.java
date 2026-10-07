package xyz.cursedman.psk.ecommerce.ordering.api;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import xyz.cursedman.psk.ecommerce.ordering.api.dto.CheckoutOptionsDto;
import xyz.cursedman.psk.ecommerce.ordering.application.CheckoutProperties;
import xyz.cursedman.psk.ecommerce.payment.application.PaymentProcessorRegistry;

@RestController
@RequestMapping("/api/checkout")
@Tag(name = "checkout")
@RequiredArgsConstructor
public class CheckoutOptionsController {

	private final CheckoutProperties checkoutProperties;

	private final PaymentProcessorRegistry paymentProcessors;

	private final CheckoutMapper checkoutMapper;

	@GetMapping("/options")
	public CheckoutOptionsDto getCheckoutOptions() {
		return checkoutMapper.toOptionsDto(checkoutProperties, paymentProcessors.availableMethods());
	}

}
