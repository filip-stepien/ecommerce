package xyz.cursedman.psk.ecommerce.catalog.api;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import org.springframework.data.domain.Page;

import xyz.cursedman.psk.ecommerce.catalog.api.dto.ProductDetailsDto;
import xyz.cursedman.psk.ecommerce.catalog.api.dto.ProductDto;
import xyz.cursedman.psk.ecommerce.catalog.api.dto.ProductPageDto;
import xyz.cursedman.psk.ecommerce.catalog.api.dto.ProductSpecificationDto;
import xyz.cursedman.psk.ecommerce.catalog.domain.Product;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductFilter;
import xyz.cursedman.psk.ecommerce.catalog.domain.ProductSpecification;
import xyz.cursedman.psk.ecommerce.config.MapStructConfig;

@Mapper(config = MapStructConfig.class)
public interface ProductMapper {

	@Mapping(target = "imageUrl", source = "images", qualifiedByName = "firstImage")
	ProductDto toDto(Product product);

	List<ProductDto> toDtos(List<Product> products);

	ProductDetailsDto toDetailsDto(Product product);

	ProductSpecificationDto toDto(ProductSpecification specification);

	ProductFilter toFilter(ProductSearchParams params);

	default ProductPageDto toPageDto(Page<Product> page) {
		return new ProductPageDto(toDtos(page.getContent()), page.getTotalElements());
	}

	@Named("firstImage")
	default String firstImage(List<String> images) {
		return images.isEmpty() ? null : images.getFirst();
	}

}
