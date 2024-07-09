package shop.sellution.server.contractcompany.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "contract_company")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@EntityListeners(AuditingEntityListener.class)
public class ContractCompany {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contract_company_id")
    private Long id;

    @Column(name = "company_id", unique = true)
    private Long companyId;

    @NotNull
    @Column(name = "contract_company_name")
    private String contractCompanyName;

    @NotNull
    @Column(name = "business_registration_number", unique = true)
    private String businessRegistrationNumber;

    @NotNull
    @Column(name = "contract_auth_id", unique = true)
    private String contractAuthId;

    @NotNull
    @Column(name = "contract_auth_password")
    private String contractAuthPassword;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @NotNull
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Builder
    public ContractCompany(String contractCompanyName, String businessRegistrationNumber, String contractAuthId, String contractAuthPassword, LocalDateTime expiresAt) {
        this.contractCompanyName = contractCompanyName;
        this.businessRegistrationNumber = businessRegistrationNumber;
        this.contractAuthId = contractAuthId;
        this.contractAuthPassword = contractAuthPassword;
        this.expiresAt = expiresAt;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public boolean isValid() {
        return LocalDateTime.now().isBefore(expiresAt);
    }
}
