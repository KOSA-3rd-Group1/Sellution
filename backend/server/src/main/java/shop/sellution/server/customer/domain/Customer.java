package shop.sellution.server.customer.domain;

import jakarta.persistence.*;
import lombok.*;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.customer.domain.type.CustomerType;
import shop.sellution.server.event.domain.CouponBox;
import shop.sellution.server.global.BaseEntity;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.global.type.UserRole;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customer")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(exclude = {"company", "couponBoxes"})
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
    @Column(name = "type", nullable = false, columnDefinition = "ENUM( 'NEW', 'NORMAL', 'DORMANT') default 'NEW'")
    @Builder.Default
    private CustomerType type = CustomerType.NEW;

    @Column(name = "easy_pwd")
    private String easyPwd;

    @Column(name = "latest_delivery_date")
    private LocalDateTime latestDeliveryDate; //최신 배송일자 필드 추가
    
    //FetchType.LAZY가 디폴트; 해당 엔티티가 실제로 조회될 때만 관련 데이터 로드
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CouponBox> couponBoxes = new ArrayList<>();

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

    public void changeName(String newName) { this.name = newName; }

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

    // 회원 유형 변경 신규,휴면 -> 일반
    public void changeToNormalCustomer() {
        this.type = CustomerType.NORMAL;
    }

    // 간편 비밀번호 갱신
    public void changeEasyPwd(String newEasyPwd) {
        this.easyPwd = newEasyPwd;
    }

    // 비밀번호 검증
    public void verifyEasyPwd(String password) {
        if (!this.easyPwd.equals(password)) {
            throw new IllegalArgumentException("간편비밀번호가 일치하지 않습니다.");
        }
    }

    // 최신 배송일자 갱신
    public void updateLatestDeliveryDate(LocalDateTime latestDeliveryDate) {
        this.latestDeliveryDate = latestDeliveryDate;
    }

    public void addCouponBox(CouponBox couponBox) {
        couponBoxes.add(couponBox);
        couponBox.setCustomer(this);
    }

    public void removeCouponBox(CouponBox couponBox) {
        couponBoxes.remove(couponBox);
        couponBox.setCustomer(null);
    }
}
