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
public class ContactDetails {

	private String firstName;

	private String lastName;

	private String email;

	private String phone;

}
