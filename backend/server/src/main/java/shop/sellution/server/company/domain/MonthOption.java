package shop.sellution.server.company.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@Table(name = "month_option")
@NoArgsConstructor
@AllArgsConstructor
public class MonthOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "month_option_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    private Integer monthValue;


    @Builder
    public MonthOption(Company company, Integer monthValue) {
        this.company = company;
        this.monthValue = monthValue;
    }
}
