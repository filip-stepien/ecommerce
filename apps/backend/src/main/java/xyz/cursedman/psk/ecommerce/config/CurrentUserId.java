package xyz.cursedman.psk.ecommerce.config;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@AuthenticationPrincipal(
	expression = "#this instanceof T(org.springframework.security.oauth2.jwt.Jwt) ? subject : null"
)
@Parameter(hidden = true)
public @interface CurrentUserId {
}
