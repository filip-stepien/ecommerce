package xyz.cursedman.psk.ecommerce.catalog.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ProductSpecification {

	@Column(nullable = false)
	private String name;

	@Column(name = "spec_value", nullable = false)
	private String value;

}
