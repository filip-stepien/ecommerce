package xyz.cursedman.psk.ecommerce;

/**
 * Request bodies for {@code POST /api/orders}.
 */
public final class OrderRequests {

	public static final String NO_INVOICE = """
		{"name": "", "taxId": "", "address": {"street": "", "houseNumber": "", "postalCode": "", "city": "", "country": "Polska"}}""";

	/** Same shape as the frontend's OrderDraft, without card details. */
	public static String orderJson(String items, String deliveryMethod, boolean isInvoiceSameAsDelivery, String invoice) {
		return """
			{
			  "items": %s,
			  "details": {
			    "contact": {"firstName": "Jan", "lastName": "Kowalski", "email": "jan@example.com", "phone": "+48 600 100 200"},
			    "address": {"street": "Długa", "houseNumber": "1", "postalCode": "00-001", "city": "Warszawa", "country": "Polska"},
			    "isInvoiceSameAsDelivery": %s,
			    "invoice": %s,
			    "deliveryMethod": "%s",
			    "paymentMethod": "blik"
			  }
			}
			""".formatted(items, isInvoiceSameAsDelivery, invoice, deliveryMethod);
	}

	public static String orderJson(String items) {
		return orderJson(items, "courier", true, NO_INVOICE);
	}

	private OrderRequests() {
	}

}
