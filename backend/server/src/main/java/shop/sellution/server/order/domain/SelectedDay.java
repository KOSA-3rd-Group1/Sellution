package shop.sellution.server.order.domain;

import jakarta.persistence.*;
import lombok.*;
import shop.sellution.server.company.domain.DayOption;

@Entity
@Table(name = "selected_day")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SelectedDay {

    @EmbeddedId
    private SelectedDayId id;

    @Setter
    @MapsId("orderId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Setter
    @MapsId("dayOptionId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "day_option_id")
    private DayOption dayOption;


}
