package shop.sellution.server.order.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.order.domain.*;
import shop.sellution.server.order.dto.response.FindOrderRes;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderedProductRepository orderedProductRepository;
    private final SelectedDayRepository selectedDayRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<FindOrderRes> findAllOrderByCustomerId(Long CustomerId,Pageable pageable) {

        Page<Order> orders = orderRepository.findAllOrderByCustomerId(CustomerId, pageable);

        List<Long> orderIds = orders.getContent().stream()
                .map(Order::getId)
                .toList();

        List<OrderedProduct> orderProducts = orderedProductRepository.findByOrderIn(orderIds);
        List<SelectedDay> selectedDays = selectedDayRepository.findByOrderId(orderIds);

        Map<Long, List<OrderedProduct>> orderProductMap = orderProducts.stream()
                .collect(Collectors.groupingBy((orderedProduct -> orderedProduct.getOrder().getId())));

        Map<Long, List<SelectedDay>> selectedDayMap = selectedDays.stream()
                .collect(Collectors.groupingBy((selectedDay -> selectedDay.getOrder().getId())));

        return orders.map(order -> FindOrderRes.fromEntities(
                order,
                orderProductMap.get(order.getId()),
                selectedDayMap.get(order.getId())
        ));
    }








}
