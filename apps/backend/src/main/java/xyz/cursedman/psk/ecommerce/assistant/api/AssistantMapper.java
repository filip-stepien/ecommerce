package xyz.cursedman.psk.ecommerce.assistant.api;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ValueMapping;

import xyz.cursedman.psk.ecommerce.assistant.api.dto.AssistantProductsDto;
import xyz.cursedman.psk.ecommerce.assistant.api.dto.AssistantStreamEventDto;
import xyz.cursedman.psk.ecommerce.assistant.api.dto.AssistantTextDto;
import xyz.cursedman.psk.ecommerce.assistant.api.dto.ChatMessageDto;
import xyz.cursedman.psk.ecommerce.assistant.api.dto.ChatRoleDto;
import xyz.cursedman.psk.ecommerce.assistant.domain.ConversationMessage;
import xyz.cursedman.psk.ecommerce.assistant.domain.ConversationRole;
import xyz.cursedman.psk.ecommerce.assistant.domain.ProductsShown;
import xyz.cursedman.psk.ecommerce.assistant.domain.ReplyChunk;
import xyz.cursedman.psk.ecommerce.assistant.domain.ReplyText;
import xyz.cursedman.psk.ecommerce.catalog.api.ProductMapper;
import xyz.cursedman.psk.ecommerce.config.MapStructConfig;

@Mapper(config = MapStructConfig.class, uses = ProductMapper.class)
public interface AssistantMapper {

	List<ConversationMessage> toConversation(List<ChatMessageDto> messages);

	@Mapping(target = "text", source = "content")
	@Mapping(target = "shownProductIds", source = "productIds")
	ConversationMessage toConversationMessage(ChatMessageDto message);

	@ValueMapping(target = "CUSTOMER", source = "USER")
	ConversationRole toConversationRole(ChatRoleDto role);

	default AssistantStreamEventDto toStreamEvent(ReplyChunk chunk) {
		return switch (chunk) {
			case ReplyText text -> toTextDto(text);
			case ProductsShown productsShown -> toProductsDto(productsShown);
		};
	}

	AssistantTextDto toTextDto(ReplyText text);

	AssistantProductsDto toProductsDto(ProductsShown productsShown);

}
