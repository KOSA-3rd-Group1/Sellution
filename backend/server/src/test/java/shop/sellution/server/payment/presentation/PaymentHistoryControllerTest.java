package shop.sellution.server.payment.presentation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.payment.application.PaymentHistoryService;
import shop.sellution.server.payment.dto.request.FindPaymentHistoryCond;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryRes;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import shop.sellution.server.payment.domain.type.PaymentStatus;


@WebMvcTest(PaymentHistoryController.class)
class PaymentHistoryControllerTest extends BaseControllerTest {

    @MockBean
    private PaymentHistoryService paymentHistoryService;


    @DisplayName("회사 ID로 결제 내역을 조회한다")
    @Test
    void findPaymentHistoryByCompanyId() throws Exception {
        // Given
        Long companyId = 1L;
        FindPaymentHistoryRes paymentHistoryRes = FindPaymentHistoryRes.builder()
                .paymentHisoryId(1L)
                .customerId(100L)
                .price(10000)
                .remainingPayCount(3)
                .totalCountForPayment(5)
                .paymentDate(LocalDateTime.now())
                .status(PaymentStatus.COMPLETE)
                .build();
        Page<FindPaymentHistoryRes> paymentHistoryPage = new PageImpl<>(Collections.singletonList(paymentHistoryRes));

        when(paymentHistoryService.findPaymentHistoryByCompanyId(eq(companyId), any(FindPaymentHistoryCond.class), any(Pageable.class)))
                .thenReturn(paymentHistoryPage);

        // When & Then
        mockMvc.perform(get("/payment-histories/company/{companyId}", companyId)
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(document("Payment/payment-history-list",
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
                                fieldWithPath("content[]").type(JsonFieldType.ARRAY).description("결제 내역 목록"),
                                fieldWithPath("content[].paymentHisoryId").type(JsonFieldType.NUMBER).description("결제 내역 ID"),
                                fieldWithPath("content[].customerId").type(JsonFieldType.NUMBER).description("고객 ID"),
                                fieldWithPath("content[].price").type(JsonFieldType.NUMBER).description("결제 금액"),
                                fieldWithPath("content[].remainingPayCount").type(JsonFieldType.NUMBER).description("남은 결제 횟수"),
                                fieldWithPath("content[].totalCountForPayment").type(JsonFieldType.NUMBER).description("총 결제해야 하는 횟수"),
                                fieldWithPath("content[].paymentDate").type(JsonFieldType.STRING).description("결제 일시"),
                                fieldWithPath("content[].status").type(JsonFieldType.STRING).description("결제 상태"),
                                fieldWithPath("pageable").type(JsonFieldType.STRING).description("페이지 정보"),
                                fieldWithPath("totalElements").type(JsonFieldType.NUMBER).description("총 결제 내역 수"),
                                fieldWithPath("totalPages").type(JsonFieldType.NUMBER).description("총 페이지 수"),
                                fieldWithPath("last").type(JsonFieldType.BOOLEAN).description("마지막 페이지 여부"),
                                fieldWithPath("size").type(JsonFieldType.NUMBER).description("페이지 크기"),
                                fieldWithPath("number").type(JsonFieldType.NUMBER).description("현재 페이지 번호"),
                                fieldWithPath("sort").type(JsonFieldType.OBJECT).description("정렬 정보"),
                                fieldWithPath("sort.empty").type(JsonFieldType.BOOLEAN).description("정렬이 비어 있는지 여부"),
                                fieldWithPath("sort.sorted").type(JsonFieldType.BOOLEAN).description("정렬되었는지 여부"),
                                fieldWithPath("sort.unsorted").type(JsonFieldType.BOOLEAN).description("정렬되지 않았는지 여부"),
                                fieldWithPath("numberOfElements").type(JsonFieldType.NUMBER).description("현재 페이지의 결제 내역 수"),
                                fieldWithPath("first").type(JsonFieldType.BOOLEAN).description("첫 페이지 여부"),
                                fieldWithPath("empty").type(JsonFieldType.BOOLEAN).description("결제 내역이 비어있는지 여부")
                        )
                ));
    }
}