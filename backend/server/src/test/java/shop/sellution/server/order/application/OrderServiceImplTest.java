package shop.sellution.server.order.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.order.domain.*;
import shop.sellution.server.order.dto.response.FindOrderRes;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderedProductRepository orderedProductRepository;

    @Mock
    private SelectedDayRepository selectedDayRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Order testOrder;
    private List<OrderedProduct> testOrderedProducts;
    private List<SelectedDay> testSelectedDays;

    @BeforeEach
    void setUp() {
        testOrder = Order.builder().build(); // Order 객체 생성 및 초기화
        testOrderedProducts = List.of(new OrderedProduct()); // OrderedProduct 리스트 생성 및 초기화
        testSelectedDays = List.of(new SelectedDay()); // SelectedDay 리스트 생성 및 초기화
    }

    @Test
    void findAllOrderByCustomerId_Success() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<Order> orderPage = new PageImpl<>(List.of(testOrder));

        when(orderRepository.findAllOrderByCustomerId(eq(1L), any(Pageable.class))).thenReturn(orderPage);
        when(orderedProductRepository.findByOrderId(any())).thenReturn(testOrderedProducts);
        when(selectedDayRepository.findByOrderId(any())).thenReturn(testSelectedDays);

        // When
        Page<FindOrderRes> result = orderService.findAllOrderByCustomerId(pageable);

        // Then
        assertEquals(1, result.getTotalElements());
    }
}