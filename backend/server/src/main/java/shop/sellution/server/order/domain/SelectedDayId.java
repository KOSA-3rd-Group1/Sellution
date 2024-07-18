package shop.sellution.server.order.domain;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class SelectedDayId implements Serializable {
    private Long orderId;
    private Long dayOptionId;

    public SelectedDayId(Long orderId, Long dayOptionId) {
        this.orderId = orderId;
        this.dayOptionId = dayOptionId;
    }
}