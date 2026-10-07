package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

/**
 * Requires a valid invoice unless the invoice goes to the delivery details.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidInvoiceValidator.class)
public @interface ValidInvoice {

	String message() default "must not be null";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

}
