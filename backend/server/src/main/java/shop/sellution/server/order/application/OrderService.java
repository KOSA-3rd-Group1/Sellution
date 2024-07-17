package shop.sellution.server.order.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.order.dto.OrderSearchCondition;
import shop.sellution.server.order.dto.response.FindOrderRes;

public interface OrderService {

    Page<FindOrderRes> findAllOrderByCustomerId(Long CustomerId,Pageable pageable);

    Page<FindOrderRes> findAllOrderByCompanyId(Long companyId, OrderSearchCondition condition, Pageable pageable);
}
