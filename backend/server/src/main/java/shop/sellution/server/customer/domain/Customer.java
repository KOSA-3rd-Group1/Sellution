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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class Customer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @NotNull
    @Column(name = "username", unique = true, length = 100)
    private String username;

    @NotNull
    @Column(name = "password", length = 100)
    private String password;

    @NotNull
    @Column(name = "name", length = 50)
    private String name;

    @NotNull
    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "is_sms_agreement", length = 1)
    private DisplayStatus isSmsAgreement = DisplayStatus.Y;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "is_in_use", length = 1)
    private DisplayStatus isInUse = DisplayStatus.N;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", length = 20)
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
