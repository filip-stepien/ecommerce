package xyz.cursedman.psk.ecommerce.assistant.domain;

import java.util.List;

import xyz.cursedman.psk.ecommerce.catalog.domain.Product;

public record ProductsShown(List<Product> products) implements ReplyChunk {
}
