package shop.sellution.server.contractcompany.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "contract_company")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
//@EntityListeners(AuditingEntityListener.class)
public class ContractCompany {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contract_company_id")
    private Long id;

    @Column(name = "company_id", unique = true)
    private Long companyId;

    @Column(name = "contract_company_name", nullable = false)
    private String contractCompanyName;

    @Column(name = "business_registration_number", unique = true, nullable = false)
    private String businessRegistrationNumber;

    @Column(name = "contract_auth_id", unique = true, nullable = false)
    private String contractAuthId;

    @Column(name = "contract_auth_password", nullable = false)
    private String contractAuthPassword;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Builder
    public ContractCompany(Long companyId, String contractCompanyName, String businessRegistrationNumber, String contractAuthId, String contractAuthPassword, LocalDateTime expiresAt) {
        this.companyId = companyId;
        this.contractCompanyName = contractCompanyName;
        this.businessRegistrationNumber = businessRegistrationNumber;
        this.contractAuthId = contractAuthId;
        this.contractAuthPassword = contractAuthPassword;
        this.expiresAt = expiresAt;
    }

    public boolean isValid() {
        return LocalDateTime.now().isBefore(expiresAt);
    }
}
