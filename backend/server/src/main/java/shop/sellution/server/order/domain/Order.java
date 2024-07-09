package shop.sellution.server.order.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.global.BaseEntity;
import shop.sellution.server.order.domain.type.OrderType;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.domain.type.DeliveryStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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

    @Column(nullable = false, unique = true)
    private Long code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.HOLD;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
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

}