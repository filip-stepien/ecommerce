package xyz.cursedman.psk.ecommerce.ordering.domain;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class InvoiceDetails {

	private String name;

	private String taxId;

	@Embedded
	private Address address;

}
