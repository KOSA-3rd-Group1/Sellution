package shop.sellution.server.company.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "month_option")
public class MonthOption {
    //월 정기배송하는 회사
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "month_option_id")
    private Long monthOptionId;

    @Column(name = "value")
    private Integer monthValue;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}
