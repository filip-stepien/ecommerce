package xyz.cursedman.psk.ecommerce.recommendation.api;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import xyz.cursedman.psk.ecommerce.catalog.api.ProductMapper;
import xyz.cursedman.psk.ecommerce.catalog.api.dto.ProductDto;
import xyz.cursedman.psk.ecommerce.config.OpenApiConfig;
import xyz.cursedman.psk.ecommerce.recommendation.application.ProductRecommender;

@RestController
@Tag(name = "products")
@RequiredArgsConstructor
public class RecommendationController {

	private final ProductRecommender productRecommender;

	private final ProductMapper productMapper;

	@GetMapping("/api/products/recommended")
	@Operation(summary = "Products recommended for the caller",
		description = "Public. With a token, products matching the customer's purchases come first; "
			+ "the rest are best-sellers and then the newest products.")
	@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
	@SecurityRequirement(name = OpenApiConfig.KEYCLOAK_AUTH)
	public List<ProductDto> getRecommendedProducts(
			@AuthenticationPrincipal Jwt jwt,
			@Parameter(description = "Maximum number of products") @RequestParam(defaultValue = "8") @Min(1) @Max(24)
			int limit) {
		return productMapper.toDtos(productRecommender.recommend(jwt != null ? jwt.getSubject() : null, limit));
	}

}
