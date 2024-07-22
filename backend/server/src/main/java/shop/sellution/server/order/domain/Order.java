package shop.sellution.server.order.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import shop.sellution.server.account.domain.Account;
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
@EntityListeners(AuditingEntityListener.class)
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "month_option_id", nullable = true)
    private MonthOption monthOption;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "week_option_id", nullable = true)
    private WeekOption weekOption;

    @Column(nullable = false, unique = true)
    private Long code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM ('ONETIME','MONTH_SUBSCRIPTION','COUNT_SUBSCRIPTION')")
    private OrderType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('HOLD','APPROVED','CANCEL') DEFAULT 'HOLD'")
    @Builder.Default
    private OrderStatus status = OrderStatus.HOLD;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('BEFORE_DELIVERY','IN_PROGRESS','COMPLETE') default 'BEFORE_DELIVERY'")
    @Builder.Default
    private DeliveryStatus deliveryStatus = DeliveryStatus.BEFORE_DELIVERY;

    @Setter
    @Column(nullable = false)
    private int totalPrice;

    @Column(nullable = false)
    private int perPrice;

    @Column(nullable = false)
    private LocalDateTime deliveryStartDate;

    @Column(nullable = false)
    private LocalDateTime deliveryEndDate;

    @Column(nullable = false)
    private LocalDateTime nextDeliveryDate;

    @Column(nullable = false)
    private int totalDeliveryCount;

    @Column(nullable = false)
    private int remainingDeliveryCount;

    @Setter
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderedProduct> orderedProducts;

    @Setter
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
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

    // 주문 승인
    public void approveOrder() {
        this.status = OrderStatus.APPROVED;
    }

    // 주문 취소
    public void cancelOrder() {
        this.status = OrderStatus.CANCEL;
    }

    // 배송 완료
    public void completeDelivery() {
        this.deliveryStatus = DeliveryStatus.COMPLETE;
    }

    // 다음 배송일 갱신
    public void updateNextDeliveryDate(LocalDateTime nextDeliveryDate) {
        this.nextDeliveryDate = nextDeliveryDate;
    }

    // 배송상태 변경
    public void changeDeliveryStatus(DeliveryStatus deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }


    // 남은 배송횟수 감소
    public void decreaseRemainingDeliveryCount() {
        this.remainingDeliveryCount--;
    }

    // 주문의 상품재고 감소
    public void decreaseProductStock() {
        orderedProducts
                .forEach(
                        orderedProduct ->
                                orderedProduct
                                        .getProduct()
                                        .decreaseStock(orderedProduct.getCount())
                );
    }
}