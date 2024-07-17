package shop.sellution.server.order.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import shop.sellution.server.order.domain.Order;

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
}
