package xyz.cursedman.psk.ecommerce.ordering.api.dto;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;

/**
 * Validates {@link OrderDetailsDto#invoice()} only when it is used, since the form always sends it.
 */
@RequiredArgsConstructor
public class ValidInvoiceValidator implements ConstraintValidator<ValidInvoice, OrderDetailsDto> {

	private final Validator validator;

	@Override
	public boolean isValid(OrderDetailsDto details, ConstraintValidatorContext context) {
		if (details == null || !Boolean.FALSE.equals(details.isInvoiceSameAsDelivery())) {
			return true;
		}
		context.disableDefaultConstraintViolation();
		if (details.invoice() == null) {
			context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
				.addPropertyNode("invoice")
				.addConstraintViolation();
			return false;
		}
		var violations = validator.validate(details.invoice());
		violations.forEach(violation -> context.buildConstraintViolationWithTemplate(violation.getMessage())
			.addPropertyNode("invoice." + violation.getPropertyPath())
			.addConstraintViolation());
		return violations.isEmpty();
	}

}
