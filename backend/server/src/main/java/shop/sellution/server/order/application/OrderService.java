package shop.sellution.server.order.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.order.dto.response.FindOrderRes;

public interface OrderService {

    public Page<FindOrderRes> findAllOrderByCustomerId(Long CustomerId,Pageable pageable);
}
