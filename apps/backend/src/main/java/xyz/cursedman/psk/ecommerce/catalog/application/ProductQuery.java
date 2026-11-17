package xyz.cursedman.psk.ecommerce.catalog.application;

import xyz.cursedman.psk.ecommerce.catalog.domain.ProductFilter;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductSortOrder;

public record ProductQuery(ProductFilter filter, ProductSortOrder sortOrder, int pageIndex, int pageSize) {
}
