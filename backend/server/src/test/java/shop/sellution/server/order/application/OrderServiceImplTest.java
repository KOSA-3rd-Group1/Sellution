package shop.sellution.server.order.application;


import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.order.domain.*;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.order.dto.response.FindOrderRes;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    @DisplayName("고객 ID로 주문 목록을 조회한다")
    void findAllOrderByCustomerId() {
        // Given
        Long customerId = 1L;
        Pageable pageable = PageRequest.of(0, 10);

        Customer mockCustomer = mock(Customer.class);
        when(mockCustomer.getId()).thenReturn(customerId);

        Address mockAddress = mock(Address.class);

        Order mockOrder = mock(Order.class);
        when(mockOrder.getCustomer()).thenReturn(mockCustomer);
        when(mockOrder.getAddress()).thenReturn(mockAddress);
        when(mockOrder.getOrderedProducts()).thenReturn(List.of());
        when(mockOrder.getSelectedDays()).thenReturn(List.of());

        List<Order> orderList = List.of(mockOrder);
        Page<Order> orderPage = new PageImpl<>(orderList, pageable, orderList.size());

        when(orderRepository.findAllOrderByCustomerId(customerId, pageable)).thenReturn(orderPage);

        // When
        Page<FindOrderRes> result = orderService.findAllOrderByCustomerId(customerId, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(orderRepository).findAllOrderByCustomerId(customerId, pageable);
    }
}