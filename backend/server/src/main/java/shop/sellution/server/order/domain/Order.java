package shop.sellution.server.order.domain;

import jakarta.persistence.*;
import lombok.*;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.MonthOption;
import shop.sellution.server.company.domain.WeekOption;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.global.BaseEntity;
import shop.sellution.server.order.domain.type.OrderType;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.domain.type.DeliveryStatus;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Order extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "month_option_id")
    private MonthOption monthOption;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "week_option_id")
    private WeekOption weekOption;

    @Column(nullable = false, unique = true)
    private Long code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.HOLD;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DeliveryStatus deliveryStatus = DeliveryStatus.BEFORE_DELIVERY;

    @Column(nullable = false)
    private int totalPrice;

    @Column(nullable = false)
    private LocalDateTime deliveryStartDate;

    @Column(nullable = false)
    private LocalDateTime deliveryEndDate;

    @Column(nullable = false)
    private int totalDeliveryCount;

    @Column(nullable = false)
    private int remainingDeliveryCount;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<OrderedProduct> orderedProducts;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<SelectedDay> selectedDays;


    // 연관관계 편의 메소드

    public void addOrderedProduct(OrderedProduct orderedProduct) {
        orderedProducts.add(orderedProduct);
        orderedProduct.setOrder(this);
    }

    public void removeOrderedProduct(OrderedProduct orderedProduct) {
        orderedProducts.remove(orderedProduct);
        orderedProduct.setOrder(null);
    }

    public void addSelectedDay(SelectedDay selectedDay) {
        selectedDays.add(selectedDay);
        selectedDay.setOrder(this);
    }

    public void removeSelectedDay(SelectedDay selectedDay) {
        selectedDays.remove(selectedDay);
        selectedDay.setOrder(null);
    }
}