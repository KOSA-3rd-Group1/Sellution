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
    private Long dayOptionId;

    @Column(name= "value")
    private DayValueType dayValue;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

}
