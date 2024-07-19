package shop.sellution.server.order.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.order.domain.*;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.order.dto.OrderSearchCondition;
import shop.sellution.server.order.dto.response.FindOrderRes;


@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<FindOrderRes> findAllOrderByCustomerId(Long CustomerId, Pageable pageable) {

        Page<Order> orders = orderRepository.findAllOrderByCustomerId(CustomerId, pageable);

        return orders.map(order -> FindOrderRes.fromEntities(
                order,
                order.getOrderedProducts(),
                order.getSelectedDays()
        ));

    }

    @Override
    @Transactional(readOnly = true)
    public Page<FindOrderRes> findAllOrderByCompanyId(Long companyId, OrderSearchCondition condition, Pageable pageable) {

        Page<Order> orders = orderRepository.findOrderByCompanyIdAndCondition(companyId, condition, pageable);

        return orders.map(order -> FindOrderRes.fromEntities(
                order,
                order.getOrderedProducts(),
                order.getSelectedDays()
        ));

    }


}
