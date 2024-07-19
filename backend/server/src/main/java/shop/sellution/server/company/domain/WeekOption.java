package shop.sellution.server.company.domain;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "week_option")
@Getter
public class WeekOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "week_option_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    private Integer weekValue;
}
