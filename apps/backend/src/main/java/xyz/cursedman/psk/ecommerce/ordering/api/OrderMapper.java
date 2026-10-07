package xyz.cursedman.psk.ecommerce.ordering.api;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import xyz.cursedman.psk.ecommerce.config.MapStructConfig;
import xyz.cursedman.psk.ecommerce.ordering.api.dto.InvoiceDto;
import xyz.cursedman.psk.ecommerce.ordering.api.dto.OrderDetailsDto;
import xyz.cursedman.psk.ecommerce.ordering.api.dto.OrderItemDto;
import xyz.cursedman.psk.ecommerce.ordering.api.dto.PlaceOrderRequestDto;
import xyz.cursedman.psk.ecommerce.ordering.api.dto.PlaceOrderResponseDto;
import xyz.cursedman.psk.ecommerce.ordering.application.PlaceOrderCommand;
import xyz.cursedman.psk.ecommerce.ordering.application.PlaceOrderResult;
import xyz.cursedman.psk.ecommerce.ordering.domain.InvoiceDetails;

@Mapper(config = MapStructConfig.class)
public interface OrderMapper {

	@Mapping(target = "contact", source = "details.contact")
	@Mapping(target = "deliveryAddress", source = "details.address")
	@Mapping(target = "invoice", source = "details", qualifiedByName = "invoice")
	@Mapping(target = "deliveryMethod", source = "details.deliveryMethod")
	@Mapping(target = "paymentMethod", source = "details.paymentMethod")
	PlaceOrderCommand toCommand(PlaceOrderRequestDto request);

	@Mapping(target = "productId", source = "id")
	PlaceOrderCommand.Line toLine(OrderItemDto item);

	InvoiceDetails toInvoice(InvoiceDto invoice);

	@Named("invoice")
	default InvoiceDetails invoice(OrderDetailsDto details) {
		return details.isInvoiceSameAsDelivery() ? null : toInvoice(details.invoice());
	}

	@Mapping(target = "orderId", source = "order.id")
	@Mapping(target = "status", source = "order.status")
	@Mapping(target = "total", source = "order.total")
	@Mapping(target = "currency", source = "order.currency")
	PlaceOrderResponseDto toResponse(PlaceOrderResult result);

}
