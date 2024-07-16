package shop.sellution.server.order.domain;

import jakarta.persistence.*;
import lombok.Getter;
import shop.sellution.server.company.domain.DayOption;

@Entity
@Table(name = "selected_day")
@Getter
public class SelectedDay {

    @EmbeddedId
    private SelectedDayId id;

    @MapsId("orderId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @MapsId("dayOptionId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "day_option_id")
    private DayOption dayOption;

    public void setOrder(Order order) {
        this.order = order;
    }
}
