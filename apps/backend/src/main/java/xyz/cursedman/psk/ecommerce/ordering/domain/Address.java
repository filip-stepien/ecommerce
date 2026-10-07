package xyz.cursedman.psk.ecommerce.ordering.domain;

import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Address {

	private String street;

	private String houseNumber;

	private String postalCode;

	private String city;

	private String country;

}
