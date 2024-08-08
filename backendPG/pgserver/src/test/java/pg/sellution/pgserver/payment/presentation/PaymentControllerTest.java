package pg.sellution.pgserver.payment.presentation;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import pg.sellution.pgserver.account.dto.request.CheckAccountReq;
import pg.sellution.pgserver.account.dto.response.CheckAccountRes;
import pg.sellution.pgserver.account.infrastructure.AccountAuthService;
import pg.sellution.pgserver.auth.application.AccessTokenService;
import pg.sellution.pgserver.common.BaseControllerTest;
import pg.sellution.pgserver.payment.dto.PaymentReq;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.headers.HeaderDocumentation.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@WebMvcTest(PaymentController.class)
class PaymentControllerTest extends BaseControllerTest {

    @MockBean
    private AccessTokenService accessTokenService;

    @MockBean
    private AccountAuthService accountAuthService;

    private final ObjectMapper objectMapper = new ObjectMapper();


    @DisplayName("결제 요청을 처리한다")
    @Test
    void pay() throws Exception {
        // Given
        PaymentReq paymentReq = new PaymentReq("123456", "1234567890", 10000);
        String token = "validToken";

        doNothing().when(accessTokenService).validateToken(eq(token), eq("payment"), eq(10000), any());
        doNothing().when(accessTokenService).invalidateToken(eq(token));
        when(accountAuthService.checkAccount(any(CheckAccountReq.class))).thenReturn(new CheckAccountRes("John Doe"));

        // When & Then
        mockMvc.perform(post("/pg/pay")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(paymentReq)))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Pay/payment-pay",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestHeaders(
                                headerWithName("Authorization").description("Bearer 인증 토큰")
                        ),
                        requestFields(
                                fieldWithPath("bankCode").description("은행 코드"),
                                fieldWithPath("accountNumber").description("계좌 번호"),
                                fieldWithPath("price").description("결제 금액")
                        ),
                        responseBody()
                ));
    }

    @DisplayName("결제 취소 요청을 처리한다")
    @Test
    void cancelPayment() throws Exception {
        // Given
        PaymentReq paymentReq = new PaymentReq("123456", "1234567890", 10000);
        String token = "validToken";

        doNothing().when(accessTokenService).validateToken(eq(token), eq("payment-cancel"), eq(10000), any());
        doNothing().when(accessTokenService).invalidateToken(eq(token));
        when(accountAuthService.checkAccount(any(CheckAccountReq.class)))
                .thenReturn(new CheckAccountRes("John Doe"));

        // When & Then
        mockMvc.perform(post("/pg/pay/cancel")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(paymentReq)))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Pay/payment-cancel",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestHeaders(
                                headerWithName("Authorization").description("Bearer 인증 토큰")
                        ),
                        requestFields(
                                fieldWithPath("bankCode").description("은행 코드"),
                                fieldWithPath("accountNumber").description("계좌 번호"),
                                fieldWithPath("price").description("취소 금액")
                        ),
                        responseBody()
                ));
    }
}