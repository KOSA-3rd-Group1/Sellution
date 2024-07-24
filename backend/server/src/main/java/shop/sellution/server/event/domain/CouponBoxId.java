package shop.sellution.server.event.domain;

import lombok.*;
import jakarta.persistence.*;
import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class CouponBoxId implements Serializable {

    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "customer_id")
    private Long customerId;
}
