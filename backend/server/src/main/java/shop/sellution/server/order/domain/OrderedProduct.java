package shop.sellution.server.order.domain;

import jakarta.persistence.*;
import lombok.*;
import shop.sellution.server.product.domain.Product;

@Entity
@Table(name = "ordered_product")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderedProduct {

    @EmbeddedId
    private OrderedProductId id;

    @MapsId("productId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @MapsId("orderId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @Setter
    private Order order;

    @Column(nullable = false)
    private int count;

    @Column(nullable = false)
    private int discountRate;

    @Column(nullable = false)
    private int price;

    @Builder
    public OrderedProduct(Product product, Order order, int count, int discountRate, int price) {
        this.product = product;
        this.order = order;
        this.count = count;
        this.discountRate = discountRate;
        this.price = price;
    }


}