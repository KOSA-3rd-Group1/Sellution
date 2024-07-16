package shop.sellution.server.order.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("""
            select o from Order o
            left join fetch o.customer
            left join fetch o.address
            left join fetch o.monthOption
            left join fetch o.weekOption
            where o.customer.id = :customerId
            """)
    Page<Order> findAllOrderByCustomerId(@Param("customerId")Long customerId, Pageable pageable);

    @Query("""
            select o from Order o
            left join fetch o.company
            left join fetch o.customer
            left join fetch o.address
            left join fetch o.monthOption
            left join fetch o.weekOption
            where o.company.companyId = :companyId
            """)
    Page<Order> findAllOrderByCompanyId(@Param("companyId")Long companyId, Pageable pageable);
}
