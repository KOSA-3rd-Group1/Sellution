package shop.sellution.server.customer.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.customer.domain.type.CustomerType;
import shop.sellution.server.global.BaseEntity;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.global.type.UserRole;

import java.time.LocalDateTime;

@Entity
@Table(name = "customer")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class Customer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "username", nullable = false, length = 100) //unique = true, 유니크 제약 제거
    private String username;

    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "phone_number", nullable = false, length = 50)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_sms_agreement", nullable = false, columnDefinition = "ENUM('N','Y') DEFAULT 'Y'")
    @Builder.Default
    private DisplayStatus isSmsAgreement = DisplayStatus.Y;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_in_use", nullable = false, columnDefinition = "ENUM('N','Y') DEFAULT 'N'")
    @Builder.Default
    private DisplayStatus isInUse = DisplayStatus.N;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, columnDefinition = "ENUM( 'NEW', 'NORMAL', 'DORMANT') default 'NEW'")
    @Builder.Default
    private CustomerType type = CustomerType.NEW;

    @Column(name = "easy_pwd")
    private String easyPwd;


    @Builder
    public Customer(Company company, String username, String password, String name, String phoneNumber) {
        this.company = company;
        this.username = username;   //회원 아이디
        this.password = password;   //회원 비밀번호
        this.name = name;   //회원 이름
        this.phoneNumber = phoneNumber;
    }

    public UserRole getUserRole() {
        return UserRole.ROLE_CUSTOMER;
    }

    //회원의 상품 주문 시
    public void activate() {
        this.isInUse = DisplayStatus.fromBoolean(true);
        this.type = CustomerType.NORMAL;
    }

    //회원의 상품 주문 종료 시
    public void deactivate() {
        this.isInUse = DisplayStatus.fromBoolean(false);
    }

    public void changeToNormal() {
        this.type = CustomerType.NORMAL;
    }

    public void changeToDormant() {
        this.type = CustomerType.DORMANT;
    }

    //간편 비밀번호 업데이트
    public void updateEasyPwd(String newEasyPwd) {
        this.easyPwd = newEasyPwd;
    }

    public void updatePhoneNumber(String newPhoneNumber) {
        this.phoneNumber = newPhoneNumber;
    }

    public void changePassword(String newPassword) {
        this.password = newPassword;
    }
}
