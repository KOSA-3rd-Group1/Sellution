package shop.sellution.server.order.application;


import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.test.util.ReflectionTestUtils;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.dto.OrderSearchCondition;
import shop.sellution.server.order.dto.request.CancelOrderReq;
import shop.sellution.server.order.dto.response.FindOrderRes;
import shop.sellution.server.payment.application.PaymentCancelService;
import shop.sellution.server.payment.application.PaymentService;
import shop.sellution.server.payment.domain.PaymentHistory;
import shop.sellution.server.payment.domain.repository.PaymentHistoryRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private PaymentCancelService paymentCancelService;

    @Mock
    private PaymentHistoryRepository paymentHistoryRepository;

    @Mock
    private PaymentService paymentService;

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

    @DisplayName("회사 ID로 주문 목록을 조회한다")
    @Test
    void findAllOrderByCompanyId_Success() {
        // given
        Long companyId = 1L;
        OrderSearchCondition condition = OrderSearchCondition.builder().build();
        Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());

        Customer customer = Customer.builder()
                .id(1L)
                .name("Test Customer")
                .phoneNumber("010-1234-5678")
                .build();

        Address address = Address.builder()
                .address("Test Address")
                .build();
        ReflectionTestUtils.setField(address, "id", 1L);


        List<Order> orders = List.of(
                Order.builder()
                        .id(1L)
                        .customer(customer)
                        .address(address)
                        .orderedProducts(new ArrayList<>())
                        .selectedDays(new ArrayList<>())
                        .build(),
                Order.builder()
                        .id(2L)
                        .customer(customer)
                        .address(address)
                        .orderedProducts(new ArrayList<>())
                        .selectedDays(new ArrayList<>())
                        .build()
        );
        Page<Order> orderPage = new PageImpl<>(orders, pageable, orders.size());

        when(orderRepository.findOrderByCompanyIdAndCondition(companyId, condition, pageable)).thenReturn(orderPage);

        // when
        Page<FindOrderRes> result = orderService.findAllOrderByCompanyId(companyId, condition, pageable);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getTotalElements()).isEqualTo(2);
        assertThat(result.getContent().get(0).getCustomer()).isNotNull();
        assertThat(result.getContent().get(0).getCustomer().getId()).isEqualTo(1L);
        assertThat(result.getContent().get(0).getAddress()).isNotNull();
        assertThat(result.getContent().get(0).getAddress().getAddress()).isEqualTo("Test Address");

        verify(orderRepository).findOrderByCompanyIdAndCondition(companyId, condition, pageable);
    }

    @DisplayName("주문을 승인한다")
    @Test
    void approveOrder_Success() {
        // given
        Long orderId = 1L;
        Order order = Order.builder().id(orderId).status(OrderStatus.HOLD).build();
        Customer customer = Customer.builder().id(1L).build();
        Account account = Account.builder().build();
        ReflectionTestUtils.setField(account, "id", 1L);
        ReflectionTestUtils.setField(order, "customer", customer);
        order.setAccount(account);
        when(orderRepository.findOrderById(orderId)).thenReturn(Optional.of(order));

        // when
        orderService.approveOrder(orderId);

        // then
        assertThat(order.getStatus()).isEqualTo(OrderStatus.APPROVED);
        verify(orderRepository).findOrderById(orderId);
        verify(paymentService).pay(any());
    }

    @DisplayName("이미 승인된 주문은 예외를 발생시킨다")
    @Test
    void approveOrder_Fail_AlreadyApproved() {
        // given
        Long orderId = 1L;
        Order order = Order.builder().id(orderId).status(OrderStatus.APPROVED).build();

        when(orderRepository.findOrderById(orderId)).thenReturn(Optional.of(order));

        // when & then
        assertThatThrownBy(() -> orderService.approveOrder(orderId))
                .isInstanceOf(BadRequestException.class);
    }

    @DisplayName("주문 자동 승인을 토글한다")
    @Test
    void toggleAutoApprove_Success() {
        // given
        Long companyId = 1L;
        Company company = Company.builder().build();
        company.toggleAutoApproval();
        ReflectionTestUtils.setField(company, "companyId", 1L);

        when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));

        // when
        orderService.toggleAutoApprove(companyId);

        // then
        assertThat(company.getIsAutoApproved()).isEqualTo(DisplayStatus.N);
        verify(companyRepository).findById(companyId);
    }

    @DisplayName("주문을 취소한다")
    @Test
    void cancelOrder_Success() {
        // given
        Long orderId = 1L;
        Long accountId = 2L;
        Order order = Order.builder().id(orderId).status(OrderStatus.APPROVED).build();
        Account account = Account.builder().build();
        ReflectionTestUtils.setField(account, "id", 1L);
        order.setAccount(account);
        CancelOrderReq cancelOrderReq = new CancelOrderReq();
        ReflectionTestUtils.setField(cancelOrderReq, "accountId", 1L);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(paymentHistoryRepository.findFirstByOrderIdOrderByCreatedAtDesc(orderId)).thenReturn(null);

        // when
        orderService.cancelOrder(orderId, cancelOrderReq);

        // then
        assertThat(order.getStatus()).isEqualTo(OrderStatus.CANCEL);
        verify(orderRepository).findById(orderId);
        verify(paymentHistoryRepository).findFirstByOrderIdOrderByCreatedAtDesc(orderId);
    }
}