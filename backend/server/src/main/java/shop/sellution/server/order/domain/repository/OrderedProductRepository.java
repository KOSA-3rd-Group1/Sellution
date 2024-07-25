package shop.sellution.server.order.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import shop.sellution.server.order.domain.OrderedProduct;

import java.util.List;

public interface OrderedProductRepository extends JpaRepository<OrderedProduct, Long> {

    @Query("""
    select op from OrderedProduct op
    join fetch op.product p
    where op.order.id in :orderIds
    """)
    List<OrderedProduct> findAllByOrderIdIn(@Param("orderIds") List<Long> orderIds);
}
