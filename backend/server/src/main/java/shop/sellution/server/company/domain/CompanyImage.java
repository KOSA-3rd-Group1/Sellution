package shop.sellution.server.company.domain;

import jakarta.persistence.*;
import lombok.*;
import shop.sellution.server.company.domain.type.ImagePurposeType;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "company_image")
public class CompanyImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_image_id")
    private Long companyImageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose_of_use")
    private ImagePurposeType purposeOfUse;
}
