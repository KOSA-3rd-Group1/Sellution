package shop.sellution.server.company.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import shop.sellution.server.company.domain.type.DayValueType;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "day_option")
public class DayOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "day_option_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Enumerated(EnumType.STRING)
    private DayValueType value;

}
