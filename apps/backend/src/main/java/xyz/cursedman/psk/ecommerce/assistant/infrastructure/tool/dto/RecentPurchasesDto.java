package xyz.cursedman.psk.ecommerce.assistant.infrastructure.tool.dto;

import java.util.List;

public record RecentPurchasesDto(boolean customerSignedIn, List<RecentPurchaseDto> purchases) {

	public static RecentPurchasesDto forGuest() {
		return new RecentPurchasesDto(false, List.of());
	}

}
