package shop.sellution.server.company.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "week_option")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WeekOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "week_option_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(nullable = false)
    private Integer weekValue;

    @Builder
    public WeekOption(Company company, Integer weekValue) {
        this.company = company;
        this.weekValue = weekValue;
    }
}
