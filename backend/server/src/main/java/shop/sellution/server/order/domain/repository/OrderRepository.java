package shop.sellution.server.order.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import shop.sellution.server.order.domain.Order;

import java.util.List;

@Repository
public interface OrderRepository extends
        JpaRepository<Order, Long>,
        QuerydslPredicateExecutor<Order>,
        OrderRepositoryCustom
{

    @Query("""
            select o from Order o
            left join fetch o.customer
            left join fetch o.address
            left join fetch o.monthOption
            left join fetch o.weekOption
            where o.customer.id = :customerId
            """)
    Page<Order> findAllOrderByCustomerId(@Param("customerId")Long customerId, Pageable pageable);

    @Query("select max(o.id) from Order o")
    Long findMaxOrderId();

    // OrderStatus가 APPROVED 이고, DeliverStatus가 BEFORE_DELIVERY 또는 IN_PROGRESS 인 Order 목록조회
    @Query("""
            select o from Order o
            where o.status = shop.sellution.server.order.domain.type.OrderStatus.APPROVED
            and o.deliveryStatus in (shop.sellution.server.order.domain.type.DeliveryStatus.BEFORE_DELIVERY,shop.sellution.server.order.domain.type.DeliveryStatus.IN_PROGRESS)
            """)
    List<Order> findOrdersForRegularPayment();
}
