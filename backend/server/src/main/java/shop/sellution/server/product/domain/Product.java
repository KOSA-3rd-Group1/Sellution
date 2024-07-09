package shop.sellution.server.product.domain;

import jakarta.persistence.*;
import lombok.*;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.global.BaseEntity;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;

import java.time.LocalDateTime;

import static shop.sellution.server.global.type.DisplayStatus.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "product")
public class Product extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id" , nullable = true)
    private Category category;

    @Column(nullable = false, unique = true)
    private long code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private int stock;

    @Column(nullable = false)
    private int cost;

    @Column(nullable = false,length = 255)
    private String productInformation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisplayStatus isVisible = Y;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryType deliveryType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisplayStatus isDiscount = N;

    @Column(nullable = false)
    private Integer discountRate = 0;

    @Column(nullable = false)
    private int discountedPrice = 0;

    @Column(nullable = true)
    private LocalDateTime discountStartDate;

    @Column(nullable = true)
    private LocalDateTime discountEndDate;

    @Column(nullable = false)
    private int previousMonthSales = 0;
}
