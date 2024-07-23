package shop.sellution.server.company.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import shop.sellution.server.company.domain.type.SellType;
import shop.sellution.server.company.domain.type.SubscriptionType;
import shop.sellution.server.global.BaseEntity;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;

import static shop.sellution.server.global.type.DisplayStatus.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "company")
public class Company{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "display_name",nullable = false)
    private String displayName;

    @Column(unique = true,nullable = false)
    private String name; //URL 설정 페이지

    @Column(name ="shop_url",nullable = false)
    private String shopUrl; //URL 설정 페이지

    @Enumerated(EnumType.STRING)
    @Column(name ="is_shop_visible",length = 1,nullable = false, columnDefinition = "ENUM('N','Y') DEFAULT 'N'" )
    @Builder.Default
    private DisplayStatus isShopVisible = N; //URL 설정 페이지

    @Enumerated(EnumType.STRING)
    @Column(name = "is_auto_approved",length = 1,nullable = false,columnDefinition = "ENUM('N','Y') DEFAULT 'N'" )
    @Builder.Default
    private DisplayStatus isAutoApproved = N;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_new_member_event",nullable = false, columnDefinition = "ENUM('N','Y') DEFAULT 'N'" )
    @Builder.Default
    private DisplayStatus isNewMemberEvent = N;

    @Enumerated(EnumType.STRING)
    @Column(name="service_type",nullable = false)
    private DeliveryType serviceType;

    @Enumerated(EnumType.STRING)
    @Column(name="subscription_type",nullable = false)
    private SubscriptionType subscriptionType;

    @Column(name="min_delivery_count",nullable = false,columnDefinition = "int default 5")
    @Builder.Default
    private int minDeliveryCount = 5;

    @Column(name="max_delivery_count",nullable = false,columnDefinition = "int default 30")
    @Builder.Default
    private int maxDeliveryCount = 30;

    @Column(name="theme_color",nullable = false, columnDefinition = "varchar(50) default 'F37021'")
    @Builder.Default
    private String themeColor = "F37021";

    @Column(name = "sell_type",nullable = false,columnDefinition = "ENUM('ALL','CATEGORY','EACH')")
    @Enumerated(EnumType.STRING)
    private SellType sellType;

    @Column(name = "main_promotion1_title",nullable = false, columnDefinition = "varchar(100) default '임시 제목입니다. 수정해주세요.'")
    @Builder.Default
    private String mainPromotion1Title = "임시 제목입니다. 수정해주세요.";

    @Column(name = "main_promotion1_content",nullable = false, columnDefinition = "varchar(200) default '임시 컨텐츠입니다. 수정해주세요.'")
    @Builder.Default
    private String mainPromotion1Content = "임시 컨텐츠입니다. 수정해주세요. ";

    @Column(name = "main_promotion2_title",nullable = false, columnDefinition = "varchar(100) default '임시 제목입니다. 수정해주세요.'")
    @Builder.Default
    private String mainPromotion2Title = "임시 제목입니다. 수정해주세요.";

    @Column(name = "main_promotion2_content",nullable = false,columnDefinition = "varchar(200) default '임시 컨텐츠입니다. 수정해주세요.'")
    @Builder.Default
    private String mainPromotion2Content = "임시 컨텐츠입니다. 수정해주세요. ";

    @Column(name = "qr_code")
    @Lob
    private byte[] qrCode;


    @Builder
    public Company(String displayName, String name) {
        this.displayName = displayName;
        this.name = name;
        this.shopUrl = generateShopUrl(name);
    }


    private String generateShopUrl(String name) {
        return "https://www.sellution.shop/shopping/" + name;
    }

    public void updateDisplayName(String newDisplayName) {
        this.displayName = newDisplayName;
    }

    public void updateName(String newName) {
        this.name = newName;
        this.shopUrl = generateShopUrl(newName);
    }

    public void updateShopVisibility(boolean value) {
        this.isShopVisible = DisplayStatus.fromBoolean(value);
    }

    public void updateAutoApproval(boolean value) {
        this.isAutoApproved = DisplayStatus.fromBoolean(value);
    }

    public void updateNewMemberEvent(boolean value) {
        this.isNewMemberEvent = DisplayStatus.fromBoolean(value);
    }

    public void updateServiceType(DeliveryType serviceType) {
        this.serviceType = serviceType;
    }

    public void updateSubscriptionType(SubscriptionType subscriptionType) {
        this.subscriptionType = subscriptionType;
    }

    public void updateDeliveryCountRange(int min, int max) {
        this.minDeliveryCount = min;
        this.maxDeliveryCount = max;
    }

    public void updateThemeColor(String themeColor) {
        this.themeColor = themeColor;
    }

    public void updateMainPromotions(String title1, String content1, String title2, String content2) {
        this.mainPromotion1Title = title1;
        this.mainPromotion1Content = content1;
        this.mainPromotion2Title = title2;
        this.mainPromotion2Content = content2;
    }

    public void updateSellType(SellType sellType) {
        this.sellType = sellType;
    }

    // 주문 자동 승인 토글
    public void toggleAutoApproval() {
        if(this.getIsAutoApproved().getValue())
        {
            this.isAutoApproved = N;
        }
        else
        {
            this.isAutoApproved = Y;
        }
    }
}
