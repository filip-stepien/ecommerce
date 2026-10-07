package xyz.cursedman.psk.ecommerce.payment.domain;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum PaymentMethod {

	BLIK("blik", "BLIK"),
	CARD("card", "Karta płatnicza");

	@Getter(onMethod_ = @JsonValue)
	private final String id;

	@Getter
	private final String displayName;

}
