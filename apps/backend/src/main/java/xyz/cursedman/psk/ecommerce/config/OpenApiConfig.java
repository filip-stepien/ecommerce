package xyz.cursedman.psk.ecommerce.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.OAuthFlow;
import io.swagger.v3.oas.annotations.security.OAuthFlows;
import io.swagger.v3.oas.annotations.security.OAuthScope;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
	info = @Info(title = "Ecommerce API", version = "v1"),
	servers = @Server(url = "/"))
@SecurityScheme(
	name = OpenApiConfig.BEARER_AUTH,
	type = SecuritySchemeType.HTTP,
	scheme = "bearer",
	bearerFormat = "JWT")
@SecurityScheme(
	name = OpenApiConfig.KEYCLOAK_AUTH,
	description = "Sign in with Keycloak (authorization code + PKCE)",
	type = SecuritySchemeType.OAUTH2,
	flows = @OAuthFlows(authorizationCode = @OAuthFlow(
		authorizationUrl = "${spring.security.oauth2.resourceserver.jwt.issuer-uri}/protocol/openid-connect/auth",
		tokenUrl = "${spring.security.oauth2.resourceserver.jwt.issuer-uri}/protocol/openid-connect/token",
		scopes = {
			@OAuthScope(name = "openid"),
			@OAuthScope(name = "profile"),
			@OAuthScope(name = "email")
		})))
public class OpenApiConfig {

	public static final String BEARER_AUTH = "bearerAuth";

	public static final String KEYCLOAK_AUTH = "keycloak";

}
