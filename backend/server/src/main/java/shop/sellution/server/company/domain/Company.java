package shop.sellution.server.company.domain;

import jakarta.persistence.*;
import lombok.*;
import shop.sellution.server.company.domain.type.SellType;
import shop.sellution.server.company.domain.type.SubscriptionType;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "company")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "display_name")
    private String displayName;

    @Column(nullable = false)
    private String name; //URL 설정 페이지

    @Column(name ="shop_url")
    private String shopUrl; //URL 설정 페이지

    @Enumerated(EnumType.STRING)
    @Column(name ="is_shop_visible")
    private DisplayStatus isShopVisible = DisplayStatus.N; //URL 설정 페이지

    @Enumerated(EnumType.STRING)
    @Column(name = "is_auto_approved")
    private DisplayStatus isAutoApproved = DisplayStatus.N;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_new_member_event")
    private DisplayStatus isNewMemberEvent = DisplayStatus.N;

    @Enumerated(EnumType.STRING)
    @Column(name="service_type")
    private DeliveryType serviceType;

    @Enumerated(EnumType.STRING)
    @Column(name="subscription_type")
    private SubscriptionType subscriptionType;

    @Column(name="min_delivery_count")
    private int minDeliveryCount = 5;

    @Column(name="max_delivery_count")
    private int maxDeliveryCount = 30;

    @Column(name="theme_color")
    private String themeColor = "F37021";

    @Column(name = "sell_type")
    private SellType sellType;

    @Column(name = "main_promotion1_title")
    private String mainPromotion1Title = "임시 제목입니다. 수정해주세요.";

    @Column(name = "main_promotion1_content")
    private String mainPromotion1Content = "임시 컨텐츠입니다. 수정해주새요. ";

    @Column(name = "main_promotion2_title")
    private String mainPromotion2Title = "임시 제목입니다. 수정해주세요.";

    @Column(name = "main_promotion2_content")
    private String mainPromotion2Content = "임시 컨텐츠입니다. 수정해주새요. ";

}
