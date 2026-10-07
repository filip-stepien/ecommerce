package xyz.cursedman.psk.ecommerce.user.api;

import java.util.List;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import xyz.cursedman.psk.ecommerce.config.OpenApiConfig;

@RestController
@RequestMapping("/api/me")
@Tag(name = "users")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
@SecurityRequirement(name = OpenApiConfig.KEYCLOAK_AUTH)
public class CurrentUserController {

	private static final String ROLE_PREFIX = "ROLE_";

	@GetMapping
	public CurrentUserDto getCurrentUser(JwtAuthenticationToken authentication) {
		List<String> roles = authentication.getAuthorities().stream()
			.map(GrantedAuthority::getAuthority)
			.filter(authority -> authority.startsWith(ROLE_PREFIX))
			.map(authority -> authority.substring(ROLE_PREFIX.length()))
			.toList();
		return new CurrentUserDto(
			authentication.getName(),
			authentication.getToken().getClaimAsString("email"),
			roles);
	}

}
