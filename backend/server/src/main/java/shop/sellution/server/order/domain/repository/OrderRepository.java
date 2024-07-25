package shop.sellution.server.order.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import shop.sellution.server.order.domain.Order;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends
        JpaRepository<Order, Long>,
        QuerydslPredicateExecutor<Order>,
        OrderRepositoryCustom {

    @Query("""
            select o from Order o
            left join fetch o.customer
            left join fetch o.address
            left join fetch o.monthOption
            left join fetch o.weekOption
            left join fetch o.couponEvent
            where o.customer.id = :customerId
            """)
    Page<Order> findAllOrderByCustomerId(@Param("customerId") Long customerId, Pageable pageable);

    @Query("select max(o.id) from Order o")
    Long findMaxOrderId();

    // OrderStatus가 APPROVED 이고, DeliverStatus가 BEFORE_DELIVERY 또는 IN_PROGRESS 이고, deliveryType이 MONTH_SUBSCRIPTION이고 nextPaymentDate가 오늘인 Order 목록조회
    @Query("""
            select distinct o from Order o
            where o.status = shop.sellution.server.order.domain.type.OrderStatus.APPROVED
            and o.deliveryStatus in (shop.sellution.server.order.domain.type.DeliveryStatus.BEFORE_DELIVERY,shop.sellution.server.order.domain.type.DeliveryStatus.IN_PROGRESS)
            and o.type = shop.sellution.server.order.domain.type.OrderType.MONTH_SUBSCRIPTION
            and o.nextPaymentDate = :date
            """)
    List<Order> findOrdersForRegularPayment(@Param("date") LocalDate date);

    // OrderStatus가 APPROVED 이고, DeliverStatus가 BEFORE_DELIVERY 또는 IN_PROGRESS 이고 nextDeliveryDate 오늘인 Order 목록조회
    @Query("""
            select distinct o from Order o
            where o.status = shop.sellution.server.order.domain.type.OrderStatus.APPROVED
            and o.deliveryStatus in (shop.sellution.server.order.domain.type.DeliveryStatus.BEFORE_DELIVERY,shop.sellution.server.order.domain.type.DeliveryStatus.IN_PROGRESS)
            and o.nextDeliveryDate = :date
            """)
    List<Order> findOrdersForRegularDelivery(@Param("date") LocalDate date);


    @Query("""
                select o from Order o
                join fetch o.customer
                where o.id = :orderId
            """)
    Optional<Order> findByOrderId(Long orderId);


    @Query("""
                    select o from Order o
                    join fetch o.customer
                    join fetch o.account
                    where o.id = :orderId
            """)
    Optional<Order> findOrderById(Long orderId);

}
