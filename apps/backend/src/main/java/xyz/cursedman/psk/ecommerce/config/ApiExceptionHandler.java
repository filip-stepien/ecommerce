package xyz.cursedman.psk.ecommerce.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import xyz.cursedman.psk.ecommerce.shared.domain.exception.ConflictException;
import xyz.cursedman.psk.ecommerce.shared.domain.exception.DomainException;
import xyz.cursedman.psk.ecommerce.shared.domain.exception.InvalidRequestException;
import xyz.cursedman.psk.ecommerce.shared.domain.exception.NotFoundException;

/**
 * Renders Spring MVC errors (inherited) and domain errors as RFC 9457 problem details.
 */
@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(DomainException.class)
	ProblemDetail handleDomainException(DomainException exception) {
		return ProblemDetail.forStatusAndDetail(statusOf(exception), exception.getMessage());
	}

	private static HttpStatus statusOf(DomainException exception) {
		return switch (exception) {
			case NotFoundException ignored -> HttpStatus.NOT_FOUND;
			case ConflictException ignored -> HttpStatus.CONFLICT;
			case InvalidRequestException ignored -> HttpStatus.BAD_REQUEST;
			default -> HttpStatus.UNPROCESSABLE_CONTENT;
		};
	}

}
