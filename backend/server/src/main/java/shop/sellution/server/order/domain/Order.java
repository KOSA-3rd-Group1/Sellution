package shop.sellution.server.order.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.event.domain.CouponEvent;
import shop.sellution.server.global.BaseEntity;
import shop.sellution.server.order.domain.type.OrderType;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.domain.type.DeliveryStatus;
import shop.sellution.server.product.domain.Product;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq")
    @SequenceGenerator(name = "order_seq", sequenceName = "order_sequence", allocationSize = 1)
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

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = true)
    private CouponEvent couponEvent;

    @Column(nullable = true)
    private Integer monthOptionValue;

    @Column(nullable = true)
    private Integer weekOptionValue;

    @Column(nullable = false, unique = true)
    private String code;

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
    private LocalDate deliveryStartDate; // 선택된 배송 시작일

    @Column(nullable = false)
    private LocalDate deliveryEndDate; // 마지막 배송일

    @Column(nullable = false)
    private LocalDate nextDeliveryDate; // 다음 배송일

    @Setter
    @Column(nullable = true)
    private LocalDate nextPaymentDate; // 다음 결제일

    @Builder.Default
    @Column(nullable = true)
    private int paymentCount =0; // 해당 주문에 대해 결제된 횟수

    @Column(nullable = false)
    private int totalDeliveryCount; // 전체 배송횟수

    @Column(nullable = false)
    private int remainingDeliveryCount; // 남은 배송횟수

    @Setter
    @Column(nullable = true)
    private Integer thisMonthDeliveryCount; // 이번달 배송횟수

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
    public void updateNextDeliveryDate(LocalDate nextDeliveryDate) {
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
        orderedProducts.forEach(orderedProduct -> {
            Product product = orderedProduct.getProduct();
            product.decreaseStock(orderedProduct.getCount());
        });
    }

    // 해당 주문의 결제 횟수 증가
    public void increasePaymentCount() {
        this.paymentCount++;
    }

    // 이번달 배송횟수 갱신 [단건,횟수 정기주문은 null로 값이 들어온다.]
    public void updateThisMonthDeliveryCount(Integer thisMonthDeliveryCount) {
        this.thisMonthDeliveryCount = thisMonthDeliveryCount;
    }

    // 주문코드 동시 생성을 위한 코드
    @PrePersist
    public void prePersist() {
        if (this.code == null) {
            this.code = generateOrderCode();
        }
    }

    private String generateOrderCode() {
        LocalDateTime now = LocalDateTime.now();
        String datePart = now.format(DateTimeFormatter.BASIC_ISO_DATE);
        String sequencePart = String.format("%06d", this.id);
        return datePart + sequencePart;
    }


}