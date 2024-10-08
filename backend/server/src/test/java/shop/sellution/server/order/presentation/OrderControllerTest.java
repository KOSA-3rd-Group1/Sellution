package shop.sellution.server.order.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.test.util.ReflectionTestUtils;
import shop.sellution.server.address.dto.response.FindAddressSummaryRes;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.company.domain.type.DayValueType;
import shop.sellution.server.customer.dto.resonse.FindCustomerSummaryRes;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.order.application.OrderCreationService;
import shop.sellution.server.order.application.OrderService;
import shop.sellution.server.order.domain.type.DeliveryStatus;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.domain.type.OrderType;
import shop.sellution.server.order.dto.OrderSearchCondition;
import shop.sellution.server.order.dto.request.CalculateReq;
import shop.sellution.server.order.dto.request.CancelOrderReq;
import shop.sellution.server.order.dto.request.FindOrderedProductSimpleReq;
import shop.sellution.server.order.dto.request.SaveOrderReq;
import shop.sellution.server.order.dto.response.CalculateRes;
import shop.sellution.server.order.dto.response.FindOrderRes;
import shop.sellution.server.order.dto.response.FindOrderedProductRes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(OrderController.class)
class OrderControllerTest extends BaseControllerTest {

    @MockBean
    private OrderService orderService;

    @MockBean
    private OrderCreationService orderCreationService;

    @Autowired
    private ObjectMapper objectMapper;

    @DisplayName("고객 ID로 주문 목록을 조회한다")
    @Test
    void findAllOrderByCustomerId_Success() throws Exception {
        // Given
        Long customerId = 1L;
        FindOrderRes orderRes = FindOrderRes.builder()
                .customer(FindCustomerSummaryRes.builder()
                        .id(1L)
                        .name("길길")
                        .phoneNumber("010-1234-5678")
                        .build())
                .address(FindAddressSummaryRes.builder()
                        .id(1L)
                        .address("공릉")
                        .name("길길")
                        .zipcode("12345")
                        .addressDetail("아파트")
                        .phoneNumber("010-1234-5678")
                        .isDefaultAddress(DisplayStatus.Y)
                        .addressName("집")
                        .createdAt(LocalDateTime.now())
                        .build())
                .orderId(1L)
                .orderCode("123456")
                .type(OrderType.ONETIME)
                .status(OrderStatus.APPROVED)
                .deliveryStatus(DeliveryStatus.IN_PROGRESS)
                .perPrice(20000)
                .totalPrice(100000)
                .deliveryStartDate(LocalDate.now())
                .nextDeliveryDate(LocalDate.now().plusDays(1))
                .deliveryEndDate(LocalDate.now().plusDays(7))
                .totalDeliveryCount(5)
                .remainingDeliveryCount(2)
                .orderedProductList(Collections.singletonList(
                        FindOrderedProductRes.builder()
                                .productId(1L)
                                .productName("Product A")
                                .count(2)
                                .discountRate(10)
                                .price(50000)
                                .build()
                ))
                .orderCreatedAt(LocalDateTime.now())
                .selectedDayList(Arrays.asList(DayValueType.MON, DayValueType.WED))
                .selectedWeekOption(1)
                .selectedMonthOption(1)
                .build();

        Page<FindOrderRes> orderPage = new PageImpl<>(Collections.singletonList(orderRes));
        when(orderService.findAllOrderByCustomerId(eq(customerId), any())).thenReturn(orderPage);

        // When & Then
        mockMvc.perform(get("/orders/customers/{customerId}", customerId)
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andDo(document("Order/order-list-by-customer",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("customerId").description("고객 ID")
                        ),
                        queryParameters(
                                parameterWithName("page").description("페이지 번호"),
                                parameterWithName("size").description("페이지 크기")
                        ),
                        responseFields(
                                fieldWithPath("content[]").type(JsonFieldType.ARRAY).description("주문 목록"),
                                fieldWithPath("content[].orderId").type(JsonFieldType.NUMBER).description("주문 ID"),
                                fieldWithPath("content[].customer.id").type(JsonFieldType.NUMBER).description("고객 ID"),
                                fieldWithPath("content[].customer.name").type(JsonFieldType.STRING).description("고객 이름"),
                                fieldWithPath("content[].customer.phoneNumber").type(JsonFieldType.STRING).description("고객 전화번호"),
                                fieldWithPath("content[].address.id").type(JsonFieldType.NUMBER).description("주소 ID"),
                                fieldWithPath("content[].address.address").type(JsonFieldType.STRING).description("주소"),
                                fieldWithPath("content[].address.name").type(JsonFieldType.STRING).description("수령인 이름"),
                                fieldWithPath("content[].accountId").type(JsonFieldType.NUMBER).optional().description("계정 ID"),
                                fieldWithPath("content[].paymentCount").type(JsonFieldType.NUMBER).optional().description("결제 횟수"),
                                fieldWithPath("content[].nextPaymentDate").type(JsonFieldType.STRING).optional().description("다음 결제일"),
                                fieldWithPath("content[].thisMonthDeliveryCount").type(JsonFieldType.NUMBER).optional().description("이번 달 배송 횟수"),
                                fieldWithPath("content[].address.zipcode").type(JsonFieldType.STRING).description("우편번호"),
                                fieldWithPath("content[].address.addressDetail").type(JsonFieldType.STRING).description("상세주소"),
                                fieldWithPath("content[].address.phoneNumber").type(JsonFieldType.STRING).description("전화번호"),
                                fieldWithPath("content[].address.isDefaultAddress").type(JsonFieldType.STRING).description("기본 주소 여부"),
                                fieldWithPath("content[].address.addressName").type(JsonFieldType.STRING).description("주소 별칭"),
                                fieldWithPath("content[].address.createdAt").type(JsonFieldType.STRING).description("주소 생성일"),
                                fieldWithPath("content[].orderCode").type(JsonFieldType.STRING).description("주문 코드"),
                                fieldWithPath("content[].type").type(JsonFieldType.STRING).description("주문 유형"),
                                fieldWithPath("content[].status").type(JsonFieldType.STRING).description("주문 상태"),
                                fieldWithPath("content[].deliveryStatus").type(JsonFieldType.STRING).description("배송 상태"),
                                fieldWithPath("content[].perPrice").type(JsonFieldType.NUMBER).description("1회 배송 가격"),
                                fieldWithPath("content[].totalPrice").type(JsonFieldType.NUMBER).description("총 가격"),
                                fieldWithPath("content[].deliveryStartDate").type(JsonFieldType.STRING).description("배송 시작일"),
                                fieldWithPath("content[].nextDeliveryDate").type(JsonFieldType.STRING).description("다음 배송일"),
                                fieldWithPath("content[].deliveryEndDate").type(JsonFieldType.STRING).description("배송 종료일"),
                                fieldWithPath("content[].totalDeliveryCount").type(JsonFieldType.NUMBER).description("총 배송 횟수"),
                                fieldWithPath("content[].remainingDeliveryCount").type(JsonFieldType.NUMBER).description("남은 배송 횟수"),
                                fieldWithPath("content[].orderedProductList[]").type(JsonFieldType.ARRAY).description("주문된 상품 목록"),
                                fieldWithPath("content[].orderedProductList[].productId").type(JsonFieldType.NUMBER).description("주문된 상품 ID"),
                                fieldWithPath("content[].orderedProductList[].productName").type(JsonFieldType.STRING).description("주문된 상품 이름"),
                                fieldWithPath("content[].orderedProductList[].count").type(JsonFieldType.NUMBER).description("주문된 상품 수량"),
                                fieldWithPath("content[].orderedProductList[].discountRate").type(JsonFieldType.NUMBER).description("할인율"),
                                fieldWithPath("content[].orderedProductList[].price").type(JsonFieldType.NUMBER).description("주문된 상품 가격"),
                                fieldWithPath("content[].orderedProductList[].productImageList").type(JsonFieldType.ARRAY).optional().description("상품 이미지 목록"),
                                fieldWithPath("content[].orderCreatedAt").type(JsonFieldType.STRING).description("주문 생성일"),
                                fieldWithPath("content[].selectedDayList[]").type(JsonFieldType.ARRAY).description("선택된 요일 목록"),
                                fieldWithPath("content[].selectedWeekOption").type(JsonFieldType.NUMBER).description("선택된 주 옵션"),
                                fieldWithPath("content[].selectedMonthOption").type(JsonFieldType.NUMBER).description("선택된 월 옵션"),
                                fieldWithPath("content[].couponEventId").type(JsonFieldType.NUMBER).optional().description("쿠폰이벤트 ID"),
                                fieldWithPath("content[].couponName").type(JsonFieldType.STRING).optional().description("쿠폰 이름"),
                                fieldWithPath("content[].couponDiscountRate").type(JsonFieldType.NUMBER).optional().description("쿠폰 할인율"),
                                fieldWithPath("pageable").type(JsonFieldType.STRING).description("페이지 정보"),
                                fieldWithPath("totalElements").type(JsonFieldType.NUMBER).description("총 주문 수"),
                                fieldWithPath("totalPages").type(JsonFieldType.NUMBER).description("총 페이지 수"),
                                fieldWithPath("last").type(JsonFieldType.BOOLEAN).description("마지막 페이지 여부"),
                                fieldWithPath("size").type(JsonFieldType.NUMBER).description("페이지 크기"),
                                fieldWithPath("number").type(JsonFieldType.NUMBER).description("현재 페이지 번호"),
                                fieldWithPath("sort.empty").type(JsonFieldType.BOOLEAN).description("정렬이 비어 있는지 여부"),
                                fieldWithPath("sort.sorted").type(JsonFieldType.BOOLEAN).description("정렬되었는지 여부"),
                                fieldWithPath("sort.unsorted").type(JsonFieldType.BOOLEAN).description("정렬되지 않았는지 여부"),
                                fieldWithPath("numberOfElements").type(JsonFieldType.NUMBER).description("현재 페이지의 주문 수"),
                                fieldWithPath("first").type(JsonFieldType.BOOLEAN).description("첫 페이지 여부"),
                                fieldWithPath("empty").type(JsonFieldType.BOOLEAN).description("주문 목록이 비어있는지 여부")
                        )
                ));


    }

    @DisplayName("회사 ID로 주문 목록을 조회한다")
    @Test
    void findAllOrderByCompanyId_Success() throws Exception {
        // Given
        Long companyId = 1L;
        FindOrderRes orderRes = FindOrderRes.builder()
                .customer(FindCustomerSummaryRes.builder().id(1L).name("길길").phoneNumber("010-1234-5678").build())
                .orderId(1L)
                .address(FindAddressSummaryRes.builder()
                        .id(1L)
                        .address("공릉")
                        .name("길길")
                        .zipcode("12345")
                        .addressDetail("아파트")
                        .phoneNumber("010-1234-5678")
                        .isDefaultAddress(DisplayStatus.Y)
                        .addressName("집")
                        .createdAt(LocalDateTime.now())
                        .build())
                .orderCode("123456")
                .type(OrderType.ONETIME)
                .status(OrderStatus.APPROVED)
                .deliveryStatus(DeliveryStatus.IN_PROGRESS)
                .perPrice(10000)
                .totalPrice(100000)
                .deliveryStartDate(LocalDate.now())
                .nextDeliveryDate(LocalDate.now().plusDays(1))
                .deliveryEndDate(LocalDate.now().plusDays(7))
                .totalDeliveryCount(5)
                .remainingDeliveryCount(2)
                .orderedProductList(Collections.singletonList(FindOrderedProductRes.builder()
                        .productId(1L)
                        .productName("Product A")
                        .count(2)
                        .price(50000)
                        .discountRate(10)
                        .build()))
                .orderCreatedAt(LocalDateTime.now())
                .selectedDayList(Arrays.asList(DayValueType.MON, DayValueType.WED))
                .selectedWeekOption(1)
                .selectedMonthOption(1)
                .build();
        Page<FindOrderRes> orderPage = new PageImpl<>(Collections.singletonList(orderRes));
        when(orderService.findAllOrderByCompanyId(eq(companyId), any(OrderSearchCondition.class), any(Pageable.class)))
                .thenReturn(orderPage);

        // When & Then
        mockMvc.perform(get("/orders/company/{companyId}", companyId)
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andDo(document("Order/order-list-by-company",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("companyId").description("회사 ID")
                        ),
                        queryParameters(
                                parameterWithName("page").description("페이지 번호"),
                                parameterWithName("size").description("페이지 크기")
                        ),
                        responseFields(
                                fieldWithPath("content").type(JsonFieldType.ARRAY).description("주문 목록"),
                                fieldWithPath("content[].orderId").type(JsonFieldType.NUMBER).description("주문 ID"),
                                fieldWithPath("content[].customer").type(JsonFieldType.OBJECT).optional().description("고객 정보"),
                                fieldWithPath("content[].customer.id").type(JsonFieldType.NUMBER).optional().description("고객 ID"),
                                fieldWithPath("content[].accountId").type(JsonFieldType.NUMBER).optional().description("계정 ID"),
                                fieldWithPath("content[].paymentCount").type(JsonFieldType.NUMBER).optional().description("결제 횟수"),
                                fieldWithPath("content[].nextPaymentDate").type(JsonFieldType.STRING).optional().description("다음 결제일"),
                                fieldWithPath("content[].thisMonthDeliveryCount").type(JsonFieldType.NUMBER).optional().description("이번 달 배송 횟수"),
                                fieldWithPath("content[].customer.name").type(JsonFieldType.STRING).optional().description("고객 이름"),
                                fieldWithPath("content[].customer.phoneNumber").type(JsonFieldType.STRING).optional().description("고객 전화번호"),
                                fieldWithPath("content[].address").type(JsonFieldType.OBJECT).optional().description("주소 정보"),
                                fieldWithPath("content[].address.id").type(JsonFieldType.NUMBER).optional().description("주소 ID"),
                                fieldWithPath("content[].address.address").type(JsonFieldType.STRING).optional().description("주소"),
                                fieldWithPath("content[].address.name").type(JsonFieldType.STRING).optional().description("수령인 이름"),
                                fieldWithPath("content[].address.zipcode").type(JsonFieldType.STRING).optional().description("우편번호"),
                                fieldWithPath("content[].address.addressDetail").type(JsonFieldType.STRING).optional().description("상세 주소"),
                                fieldWithPath("content[].address.phoneNumber").type(JsonFieldType.STRING).optional().description("전화번호"),
                                fieldWithPath("content[].address.isDefaultAddress").type(JsonFieldType.STRING).optional().description("기본 주소 여부"),
                                fieldWithPath("content[].address.addressName").type(JsonFieldType.STRING).optional().description("주소 별칭"),
                                fieldWithPath("content[].address.createdAt").type(JsonFieldType.STRING).optional().description("주소 생성일"),
                                fieldWithPath("content[].orderCode").type(JsonFieldType.STRING).description("주문 코드"),
                                fieldWithPath("content[].type").type(JsonFieldType.STRING).description("주문 유형"),
                                fieldWithPath("content[].status").type(JsonFieldType.STRING).description("주문 상태"),
                                fieldWithPath("content[].deliveryStatus").type(JsonFieldType.STRING).description("배송 상태"),
                                fieldWithPath("content[].perPrice").type(JsonFieldType.NUMBER).description("1회 배송 가격"),
                                fieldWithPath("content[].totalPrice").type(JsonFieldType.NUMBER).description("총 가격"),
                                fieldWithPath("content[].deliveryStartDate").type(JsonFieldType.STRING).description("배송 시작일"),
                                fieldWithPath("content[].nextDeliveryDate").type(JsonFieldType.STRING).optional().description("다음 배송일"),
                                fieldWithPath("content[].deliveryEndDate").type(JsonFieldType.STRING).description("배송 종료일"),
                                fieldWithPath("content[].totalDeliveryCount").type(JsonFieldType.NUMBER).description("총 배송 횟수"),
                                fieldWithPath("content[].remainingDeliveryCount").type(JsonFieldType.NUMBER).description("남은 배송 횟수"),
                                fieldWithPath("content[].orderedProductList").type(JsonFieldType.ARRAY).description("주문된 상품 목록"),
                                fieldWithPath("content[].orderedProductList[].productId").type(JsonFieldType.NUMBER).description("상품 ID"),
                                fieldWithPath("content[].orderedProductList[].productName").type(JsonFieldType.STRING).description("상품 이름"),
                                fieldWithPath("content[].orderedProductList[].count").type(JsonFieldType.NUMBER).description("상품 수량"),
                                fieldWithPath("content[].orderedProductList[].price").type(JsonFieldType.NUMBER).description("상품 가격"),
                                fieldWithPath("content[].orderedProductList[].discountRate").type(JsonFieldType.NUMBER).description("할인율"),
                                fieldWithPath("content[].orderedProductList[].productImageList").type(JsonFieldType.ARRAY).optional().description("상품 이미지 목록"),
                                fieldWithPath("content[].orderCreatedAt").type(JsonFieldType.STRING).description("주문 생성일"),
                                fieldWithPath("content[].selectedDayList").type(JsonFieldType.ARRAY).description("선택된 요일 목록"),
                                fieldWithPath("content[].selectedWeekOption").type(JsonFieldType.NUMBER).optional().description("선택된 주 옵션"),
                                fieldWithPath("content[].selectedMonthOption").type(JsonFieldType.NUMBER).optional().description("선택된 월 옵션"),
                                fieldWithPath("content[].couponEventId").type(JsonFieldType.NUMBER).optional().description("쿠폰이벤트 ID"),
                                fieldWithPath("content[].couponName").type(JsonFieldType.STRING).optional().description("쿠폰 이름"),
                                fieldWithPath("content[].couponDiscountRate").type(JsonFieldType.NUMBER).optional().description("쿠폰 할인율"),
                                fieldWithPath("pageable").type(JsonFieldType.STRING).description("페이지 정보"),
                                fieldWithPath("totalElements").type(JsonFieldType.NUMBER).description("총 주문 수"),
                                fieldWithPath("totalPages").type(JsonFieldType.NUMBER).description("총 페이지 수"),
                                fieldWithPath("last").type(JsonFieldType.BOOLEAN).description("마지막 페이지 여부"),
                                fieldWithPath("size").type(JsonFieldType.NUMBER).description("페이지 크기"),
                                fieldWithPath("number").type(JsonFieldType.NUMBER).description("현재 페이지 번호"),
                                fieldWithPath("sort").type(JsonFieldType.OBJECT).description("정렬 정보"),
                                fieldWithPath("sort.empty").type(JsonFieldType.BOOLEAN).description("정렬이 비어 있는지 여부"),
                                fieldWithPath("sort.sorted").type(JsonFieldType.BOOLEAN).description("정렬되었는지 여부"),
                                fieldWithPath("sort.unsorted").type(JsonFieldType.BOOLEAN).description("정렬되지 않았는지 여부"),
                                fieldWithPath("numberOfElements").type(JsonFieldType.NUMBER).description("현재 페이지의 주문 수"),
                                fieldWithPath("first").type(JsonFieldType.BOOLEAN).description("첫 페이지 여부"),
                                fieldWithPath("empty").type(JsonFieldType.BOOLEAN).description("주문 목록이 비어있는지 여부")
                        )
                ));
    }

    @DisplayName("주문을 생성한다")
    @Test
    void order_Success() throws Exception {
        // Given
        Long customerId = 1L;
        SaveOrderReq saveOrderReq = SaveOrderReq.builder()
                .companyId(1L)
                .addressId(1L)
                .accountId(1L)
                .eventId(1L)
                .orderType(OrderType.ONETIME)
                .deliveryStartDate(LocalDate.now().plusDays(3))
                .orderedProducts(Collections.singletonList(
                        FindOrderedProductSimpleReq.builder()
                                .productId(1L)
                                .count(2)
                                .discountRate(10)
                                .price(1000)
                                .build()
                ))
                .build();

        when(orderCreationService.createOrder(eq(customerId), any(SaveOrderReq.class))).thenReturn(1L);

        // When & Then
        mockMvc.perform(post("/orders/customers/{customerId}", customerId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saveOrderReq)))
                .andExpect(status().isOk())
                .andExpect(content().string("success, 생성된 주문 아이디 : 1"))
                .andDo(document("Order/create-order",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("customerId").description("고객 ID")
                        ),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("addressId").type(JsonFieldType.NUMBER).description("주소 ID"),
                                fieldWithPath("accountId").type(JsonFieldType.NUMBER).description("계정 ID"),
                                fieldWithPath("eventId").type(JsonFieldType.NUMBER).optional().description("쿠폰이벤트 ID"),
                                fieldWithPath("monthOptionValue").type(JsonFieldType.NUMBER).optional().description("월 옵션 값"),
                                fieldWithPath("weekOptionValue").type(JsonFieldType.NUMBER).optional().description("주 옵션 값"),
                                fieldWithPath("orderType").type(JsonFieldType.STRING).description("주문 타입"),
                                fieldWithPath("totalDeliveryCount").type(JsonFieldType.NUMBER).optional().description("총 배송 횟수"),
                                fieldWithPath("deliveryStartDate").type(JsonFieldType.STRING).description("배송 시작일"),
                                fieldWithPath("orderedProducts").type(JsonFieldType.ARRAY).description("주문 상품 목록"),
                                fieldWithPath("orderedProducts[].productId").type(JsonFieldType.NUMBER).description("상품 ID"),
                                fieldWithPath("orderedProducts[].count").type(JsonFieldType.NUMBER).description("상품 수량"),
                                fieldWithPath("orderedProducts[].discountRate").type(JsonFieldType.NUMBER).description("할인율"),
                                fieldWithPath("orderedProducts[].price").type(JsonFieldType.NUMBER).description("가격"),
                                fieldWithPath("dayValueTypeList").type(JsonFieldType.ARRAY).optional().description("요일 옵션 목록")
                        )
                ));
    }

    @DisplayName("주문을 취소한다")
    @Test
    void cancelOrder_Success() throws Exception {
        // Given
        Long orderId = 1L;
        CancelOrderReq cancelOrderReq = new CancelOrderReq();
        ReflectionTestUtils.setField(cancelOrderReq, "customerId", 1L);
        ReflectionTestUtils.setField(cancelOrderReq, "accountId", 1L);

        doNothing().when(orderService).cancelOrder(eq(orderId), any(CancelOrderReq.class));

        // When & Then
        mockMvc.perform(post("/orders/{orderId}/cancel", orderId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cancelOrderReq)))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Order/cancel-order",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("orderId").description("주문 ID")
                        ),
                        requestFields(
                                fieldWithPath("customerId").type(JsonFieldType.NUMBER).description("고객 ID"),
                                fieldWithPath("accountId").type(JsonFieldType.NUMBER).description("계정 ID")
                        )
                ));
    }

    @DisplayName("주문을 승인한다")
    @Test
    void approveOrder_Success() throws Exception {
        // Given
        Long orderId = 1L;

        doNothing().when(orderService).approveOrder(orderId);

        // When & Then
        mockMvc.perform(post("/orders/{orderId}/approve", orderId))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Order/approve-order",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("orderId").description("주문 ID")
                        )
                ));
    }
    @DisplayName("주문 자동 승인을 토글한다")
    @Test
    void toggleAutoApprove_Success() throws Exception {
        // Given
        Long companyId = 1L;

        doNothing().when(orderService).toggleAutoApprove(companyId);

        // When & Then
        mockMvc.perform(post("/orders/auto-approve-toggle/company/{companyId}", companyId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Order/toggle-auto-approve",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("companyId").description("회사 ID")
                        )
                ));
    }

    @DisplayName("주문 ID로 주문을 조회한다")
    @Test
    void findOrderById_Success() throws Exception {
        // Given
        Long orderId = 1L;
        FindOrderRes orderRes = FindOrderRes.builder()
                .customer(FindCustomerSummaryRes.builder().id(1L).name("Test Customer").phoneNumber("010-1234-5678").build())
                .orderId(1L)
                .address(FindAddressSummaryRes.builder()
                        .id(1L)
                        .address("Test Address")
                        .name("Test Name")
                        .zipcode("12345")
                        .addressDetail("Test Detail")
                        .phoneNumber("010-1234-5678")
                        .isDefaultAddress(DisplayStatus.Y)
                        .addressName("Home")
                        .createdAt(LocalDateTime.now())
                        .build())
                .orderCode("123456")
                .type(OrderType.ONETIME)
                .status(OrderStatus.APPROVED)
                .deliveryStatus(DeliveryStatus.IN_PROGRESS)
                .perPrice(20000)
                .totalPrice(100000)
                .deliveryStartDate(LocalDate.now())
                .nextDeliveryDate(LocalDate.now().plusDays(1))
                .deliveryEndDate(LocalDate.now().plusDays(7))
                .totalDeliveryCount(1)
                .remainingDeliveryCount(1)
                .orderedProductList(Collections.singletonList(FindOrderedProductRes.builder()
                        .productId(1L)
                        .productName("Test Product")
                        .count(2)
                        .price(50000)
                        .discountRate(10)
                        .build()))
                .orderCreatedAt(LocalDateTime.now())
                .nextDeliveryDate(LocalDate.now().plusDays(1))
                .build();

        when(orderService.findOrder(orderId)).thenReturn(orderRes);

        // When & Then
        mockMvc.perform(get("/orders/{orderId}", orderId))
                .andExpect(status().isOk())
                .andDo(document("Order/find-order-by-id",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("orderId").description("주문 ID")
                        ),
                        responseFields(
                                fieldWithPath("orderId").type(JsonFieldType.NUMBER).description("주문 ID"),
                                fieldWithPath("customer").type(JsonFieldType.OBJECT).description("고객 정보"),
                                fieldWithPath("customer.id").type(JsonFieldType.NUMBER).description("고객 ID"),
                                fieldWithPath("customer.name").type(JsonFieldType.STRING).description("고객 이름"),
                                fieldWithPath("customer.phoneNumber").type(JsonFieldType.STRING).description("고객 전화번호"),
                                fieldWithPath("accountId").type(JsonFieldType.NUMBER).optional().description("계정 ID"),
                                fieldWithPath("paymentCount").type(JsonFieldType.NUMBER).optional().description("결제 횟수"),
                                fieldWithPath("nextPaymentDate").type(JsonFieldType.STRING).optional().description("다음 결제일"),
                                fieldWithPath("thisMonthDeliveryCount").type(JsonFieldType.NUMBER).optional().description("이번 달 배송 횟수"),
                                fieldWithPath("address").type(JsonFieldType.OBJECT).description("주소 정보"),
                                fieldWithPath("address.id").type(JsonFieldType.NUMBER).description("주소 ID"),
                                fieldWithPath("address.address").type(JsonFieldType.STRING).description("주소"),
                                fieldWithPath("address.name").type(JsonFieldType.STRING).description("수령인 이름"),
                                fieldWithPath("address.zipcode").type(JsonFieldType.STRING).description("우편번호"),
                                fieldWithPath("address.addressDetail").type(JsonFieldType.STRING).description("상세 주소"),
                                fieldWithPath("address.phoneNumber").type(JsonFieldType.STRING).description("전화번호"),
                                fieldWithPath("address.isDefaultAddress").type(JsonFieldType.STRING).description("기본 주소 여부"),
                                fieldWithPath("address.addressName").type(JsonFieldType.STRING).description("주소 별칭"),
                                fieldWithPath("address.createdAt").type(JsonFieldType.STRING).description("주소 생성일"),
                                fieldWithPath("orderCode").type(JsonFieldType.STRING).description("주문 코드"),
                                fieldWithPath("type").type(JsonFieldType.STRING).description("주문 유형"),
                                fieldWithPath("status").type(JsonFieldType.STRING).description("주문 상태"),
                                fieldWithPath("deliveryStatus").type(JsonFieldType.STRING).description("배송 상태"),
                                fieldWithPath("perPrice").type(JsonFieldType.NUMBER).description("1회 배송 가격"),
                                fieldWithPath("totalPrice").type(JsonFieldType.NUMBER).description("총 가격"),
                                fieldWithPath("deliveryStartDate").type(JsonFieldType.STRING).description("배송 시작일"),
                                fieldWithPath("deliveryEndDate").type(JsonFieldType.STRING).description("배송 종료일"),
                                fieldWithPath("nextDeliveryDate").type(JsonFieldType.STRING).description("다음 배송일"),
                                fieldWithPath("totalDeliveryCount").type(JsonFieldType.NUMBER).description("총 배송 횟수"),
                                fieldWithPath("remainingDeliveryCount").type(JsonFieldType.NUMBER).description("남은 배송 횟수"),
                                fieldWithPath("orderedProductList").type(JsonFieldType.ARRAY).description("주문된 상품 목록"),
                                fieldWithPath("orderedProductList[].productId").type(JsonFieldType.NUMBER).description("상품 ID"),
                                fieldWithPath("orderedProductList[].productName").type(JsonFieldType.STRING).description("상품 이름"),
                                fieldWithPath("orderedProductList[].count").type(JsonFieldType.NUMBER).description("상품 수량"),
                                fieldWithPath("orderedProductList[].price").type(JsonFieldType.NUMBER).description("상품 가격"),
                                fieldWithPath("orderedProductList[].discountRate").type(JsonFieldType.NUMBER).description("할인율"),
                                fieldWithPath("orderedProductList[].productImageList").type(JsonFieldType.ARRAY).optional().description("상품 이미지 목록"),
                                fieldWithPath("orderCreatedAt").type(JsonFieldType.STRING).description("주문 생성일"),
                                fieldWithPath("selectedDayList").type(JsonFieldType.ARRAY).optional().description("선택된 배송 요일 목록"),
                                fieldWithPath("selectedWeekOption").type(JsonFieldType.STRING).optional().description("선택된 주 옵션"),
                                fieldWithPath("selectedMonthOption").type(JsonFieldType.STRING).optional().description("선택된 월 옵션"),
                                fieldWithPath("couponEventId").type(JsonFieldType.NUMBER).optional().description("쿠폰이벤트 ID"),
                                fieldWithPath("couponName").type(JsonFieldType.STRING).optional().description("쿠폰 이름"),
                                fieldWithPath("couponDiscountRate").type(JsonFieldType.NUMBER).optional().description("쿠폰 할인율")
                        )
                ));
    }

    @DisplayName("주문 ID로 주문된 상품의 재고가 충분한지 확인한다")
    @Test
    void checkStock_Success() throws Exception {
        // Given
        Long orderId = 1L;
        when(orderService.checkStock(orderId)).thenReturn(true);

        // When & Then
        mockMvc.perform(get("/orders/{orderId}/enough-stock", orderId))
                .andExpect(status().isOk())
                .andExpect(content().string("true"))
                .andDo(document("Order/check-enough-stock",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("orderId").description("주문 ID")
                        ),
                        responseBody()
                ));

        // Additional test for false case
        when(orderService.checkStock(orderId)).thenReturn(false);

        mockMvc.perform(get("/orders/{orderId}/enough-stock", orderId))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }
    @DisplayName("정기주문(월) 가격 계산")
    @Test
    void calculatePrice_Success() throws Exception {
        // Given
        CalculateReq calculateReq = new CalculateReq();
        calculateReq.setSelectedDays(Arrays.asList(DayValueType.MON, DayValueType.WED, DayValueType.FRI));
        calculateReq.setWeekOptionValue(2);
        calculateReq.setMonthOptionValue(null);
        calculateReq.setPerPrice(10000);
        calculateReq.setStartDate(LocalDate.now());

        CalculateRes calculateRes = CalculateRes.builder()
                .thisMonthDeliveryCount(8)
                .thisMonthPrice(80000)
                .totalDeliveryCount(24)
                .totalPrice(240000)
                .deliveryNextDate(LocalDate.now().plusDays(1))
                .deliveryEndDate(LocalDate.now().plusMonths(2))
                .build();

        when(orderService.calculatePrice(any(CalculateReq.class))).thenReturn(calculateRes);

        // When & Then
        mockMvc.perform(post("/orders/month/calculate-price")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(calculateReq)))
                .andExpect(status().isOk())
                .andDo(document("Order/calculate-price",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("selectedDays").type(JsonFieldType.ARRAY).description("선택된 요일 목록"),
                                fieldWithPath("weekOptionValue").type(JsonFieldType.NUMBER).description("주 옵션 값"),
                                fieldWithPath("monthOptionValue").type(JsonFieldType.NUMBER).optional().description("월 옵션 값"),
                                fieldWithPath("perPrice").type(JsonFieldType.NUMBER).description("1회 배송 가격"),
                                fieldWithPath("startDate").type(JsonFieldType.STRING).description("시작 날짜")
                        ),
                        responseFields(
                                fieldWithPath("thisMonthDeliveryCount").type(JsonFieldType.NUMBER).description("이번 달 배송 횟수"),
                                fieldWithPath("thisMonthPrice").type(JsonFieldType.NUMBER).description("이번 달 가격"),
                                fieldWithPath("totalDeliveryCount").type(JsonFieldType.NUMBER).description("총 배송 횟수"),
                                fieldWithPath("totalPrice").type(JsonFieldType.NUMBER).description("총 가격"),
                                fieldWithPath("deliveryNextDate").type(JsonFieldType.STRING).description("다음 배송일"),
                                fieldWithPath("deliveryEndDate").type(JsonFieldType.STRING).description("배송 종료일")
                        )
                ));
    }

    @DisplayName("정기주문(횟수) 정보 조회")
    @Test
    void getCountOrderDeliveryInfo_Success() throws Exception {
        // Given
        CalculateReq calculateReq = new CalculateReq();
        calculateReq.setSelectedDays(Arrays.asList(DayValueType.TUE, DayValueType.THU));
        calculateReq.setWeekOptionValue(1);
        calculateReq.setMonthOptionValue(null);
        calculateReq.setPerPrice(15000);
        calculateReq.setStartDate(LocalDate.now());

        CalculateRes calculateRes = CalculateRes.builder()
                .thisMonthDeliveryCount(6)
                .thisMonthPrice(90000)
                .totalDeliveryCount(18)
                .totalPrice(270000)
                .deliveryNextDate(LocalDate.now().plusDays(2))
                .deliveryEndDate(LocalDate.now().plusMonths(3))
                .build();

        when(orderService.calculatePrice(any(CalculateReq.class))).thenReturn(calculateRes);

        // When & Then
        mockMvc.perform(post("/orders/count/info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(calculateReq)))
                .andExpect(status().isOk())
                .andDo(document("Order/count-order-info",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("selectedDays").type(JsonFieldType.ARRAY).description("선택된 요일 목록"),
                                fieldWithPath("weekOptionValue").type(JsonFieldType.NUMBER).description("주 옵션 값"),
                                fieldWithPath("monthOptionValue").type(JsonFieldType.NUMBER).optional().description("월 옵션 값"),
                                fieldWithPath("perPrice").type(JsonFieldType.NUMBER).description("1회 배송 가격"),
                                fieldWithPath("startDate").type(JsonFieldType.STRING).description("시작 날짜")
                        ),
                        responseFields(
                                fieldWithPath("thisMonthDeliveryCount").type(JsonFieldType.NUMBER).description("이번 달 배송 횟수"),
                                fieldWithPath("thisMonthPrice").type(JsonFieldType.NUMBER).description("이번 달 가격"),
                                fieldWithPath("totalDeliveryCount").type(JsonFieldType.NUMBER).description("총 배송 횟수"),
                                fieldWithPath("totalPrice").type(JsonFieldType.NUMBER).description("총 가격"),
                                fieldWithPath("deliveryNextDate").type(JsonFieldType.STRING).description("다음 배송일"),
                                fieldWithPath("deliveryEndDate").type(JsonFieldType.STRING).description("배송 종료일")
                        )
                ));
    }

    @DisplayName("승인되지 않은 주문 수 조회")
    @Test
    void getUnapprovedOrderCount_Success() throws Exception {
        // Given
        Long companyId = 1L;
        Long unapprovedCount = 5L;

        when(orderService.getUnapprovedOrderCount(companyId)).thenReturn(unapprovedCount);

        // When & Then
        mockMvc.perform(get("/orders/company/{companyId}/unapproved-count", companyId))
                .andExpect(status().isOk())
                .andExpect(content().string(unapprovedCount.toString()))
                .andDo(document("Order/unapproved-order-count",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("companyId").description("회사 ID")
                        ),
                        responseBody()
                ));
    }

}
