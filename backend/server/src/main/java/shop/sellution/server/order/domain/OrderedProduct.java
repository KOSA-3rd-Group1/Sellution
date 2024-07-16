package shop.sellution.server.order.domain;

import jakarta.persistence.*;
import lombok.Getter;
import shop.sellution.server.product.domain.Product;

@Entity
@Table(name = "ordered_product")
@Getter
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
    private Order order;

    @Column(nullable = false)
    private int count;

    @Column(nullable = false)
    private int discountRate;

    @Column(nullable = false)
    private int price;

    public void setOrder(Order order) {
        this.order = order;
    }
}