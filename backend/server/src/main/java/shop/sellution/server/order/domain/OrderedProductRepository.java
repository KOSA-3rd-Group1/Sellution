package shop.sellution.server.order.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderedProductRepository extends JpaRepository<OrderedProduct, Long> {

    @Query("""
            select op from OrderedProduct op
            join fetch op.product
            join fetch op.order
            where op.order.id in :orderIds
            """)
    List<OrderedProduct> findByOrderIn(List<Long> orderIds);
}
