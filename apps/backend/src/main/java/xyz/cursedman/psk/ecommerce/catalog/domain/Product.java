package xyz.cursedman.psk.ecommerce.catalog.domain;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import xyz.cursedman.psk.ecommerce.catalog.domain.exception.InsufficientStockException;

@Entity
@Table(name = "product")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	private String subtitle;

	@Column(columnDefinition = "text")
	private String description;

	@Column(nullable = false)
	private String brand;

	@Column(nullable = false)
	private String category;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal price;

	@Column(nullable = false)
	private int stock;

	@ElementCollection
	@CollectionTable(name = "product_connectivity", joinColumns = @JoinColumn(name = "product_id"))
	@OrderColumn(name = "position")
	@Column(name = "connectivity", nullable = false)
	private List<String> connectivity = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "product_image", joinColumns = @JoinColumn(name = "product_id"))
	@OrderColumn(name = "position")
	@Column(name = "url", nullable = false)
	private List<String> images = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "product_specification", joinColumns = @JoinColumn(name = "product_id"))
	@OrderColumn(name = "position")
	private List<ProductSpecification> specifications = new ArrayList<>();

	public void reserveStock(int quantity) {
		if (quantity > stock) {
			throw new InsufficientStockException(id, name, quantity, stock);
		}
		stock -= quantity;
	}

	public void releaseStock(int quantity) {
		stock += quantity;
	}

}
