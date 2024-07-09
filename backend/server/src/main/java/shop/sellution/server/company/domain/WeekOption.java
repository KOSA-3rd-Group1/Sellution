package shop.sellution.server.company.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import shop.sellution.server.global.type.WeekType;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "week_option")
public class WeekOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "week_option_id")
    private Long weekOptionId;

    @Column(name = "value", nullable = false)
    private WeekType weekValue;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
