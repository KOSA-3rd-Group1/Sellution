package shop.sellution.server.order.domain;

import jakarta.persistence.*;
import lombok.*;
import shop.sellution.server.company.domain.type.DayValueType;

@Entity
@Table(name = "selected_day")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SelectedDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "selected_day_id")
    private Long id;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(nullable = false)
    private DayValueType dayValueType;
}
