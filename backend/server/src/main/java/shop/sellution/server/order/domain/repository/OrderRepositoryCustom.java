package shop.sellution.server.order.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.dto.OrderSearchCondition;

public interface OrderRepositoryCustom {

    Page<Order> findOrderByCompanyIdAndCondition(Long companyId, OrderSearchCondition condition, Pageable pageable);
}
