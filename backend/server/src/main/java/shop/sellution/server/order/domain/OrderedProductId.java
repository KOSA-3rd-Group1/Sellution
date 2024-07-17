package shop.sellution.server.order.domain;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class OrderedProductId implements Serializable {
    private Long productId;
    private Long orderId;

    public OrderedProductId(Long productId, Long orderId) {
        this.productId = productId;
        this.orderId = orderId;
    }
}