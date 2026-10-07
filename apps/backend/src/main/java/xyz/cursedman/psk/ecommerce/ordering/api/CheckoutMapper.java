package xyz.cursedman.psk.ecommerce.ordering.api;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import xyz.cursedman.psk.ecommerce.config.MapStructConfig;
import xyz.cursedman.psk.ecommerce.ordering.api.dto.CheckoutOptionsDto;
import xyz.cursedman.psk.ecommerce.ordering.api.dto.DeliveryMethodDto;
import xyz.cursedman.psk.ecommerce.ordering.api.dto.PaymentMethodDto;
import xyz.cursedman.psk.ecommerce.ordering.application.CheckoutProperties;
import xyz.cursedman.psk.ecommerce.ordering.domain.DeliveryMethod;
import xyz.cursedman.psk.ecommerce.payment.domain.PaymentMethod;

@Mapper(config = MapStructConfig.class)
public interface CheckoutMapper {

	@Mapping(target = "paymentMethods", source = "paymentMethods")
	CheckoutOptionsDto toOptionsDto(CheckoutProperties properties, List<PaymentMethod> paymentMethods);

	DeliveryMethodDto toDto(DeliveryMethod deliveryMethod);

	@Mapping(target = "id", source = ".")
	@Mapping(target = "name", source = "displayName")
	PaymentMethodDto toDto(PaymentMethod paymentMethod);

}
