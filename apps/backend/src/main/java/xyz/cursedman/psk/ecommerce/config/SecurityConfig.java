package xyz.cursedman.psk.ecommerce.config;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.cors(cors -> cors.configurationSource(allowAllCorsConfigurationSource()))
			.csrf(AbstractHttpConfigurer::disable)
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
				.requestMatchers(HttpMethod.GET, "/api/products/**", "/api/checkout/options").permitAll()
				.requestMatchers("/api/orders/**").hasRole("user")
				.anyRequest().authenticated())
			.oauth2ResourceServer(oauth2 -> oauth2
				.jwt(jwt -> jwt.jwtAuthenticationConverter(keycloakJwtAuthenticationConverter())));
		return http.build();
	}

	// Allows any origin so the API can be called directly during local development.
	// Safe without credentials because auth uses the Authorization header, not cookies.
	private static CorsConfigurationSource allowAllCorsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.addAllowedOriginPattern("*");
		configuration.addAllowedMethod("*");
		configuration.addAllowedHeader("*");
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	private static JwtAuthenticationConverter keycloakJwtAuthenticationConverter() {
		JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
		converter.setPrincipalClaimName("preferred_username");
		converter.setJwtGrantedAuthoritiesConverter(SecurityConfig::realmRoles);
		return converter;
	}

	private static Collection<GrantedAuthority> realmRoles(Jwt jwt) {
		Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
		if (realmAccess == null || !(realmAccess.get("roles") instanceof Collection<?> roles)) {
			return List.of();
		}
		return roles.stream()
			.<GrantedAuthority>map(role -> new SimpleGrantedAuthority("ROLE_" + role))
			.toList();
	}

}
