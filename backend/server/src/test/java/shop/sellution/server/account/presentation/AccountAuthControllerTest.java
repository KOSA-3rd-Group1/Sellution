package shop.sellution.server.account.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import reactor.core.publisher.Mono;
import shop.sellution.server.account.dto.request.CheckAccountReq;
import shop.sellution.server.account.dto.response.CheckAccountRes;
import shop.sellution.server.account.infrastructure.AccountAuthService;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExternalApiException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(AccountAuthController.class)
class AccountAuthControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AccountAuthService accountAuthService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    @DisplayName("계좌 주인 확인")
    void checkAccount_Success() throws Exception {
        // given
        CheckAccountReq request = new CheckAccountReq("004", "1234567890");
        CheckAccountRes response = new CheckAccountRes("홍길동");

        when(accountAuthService.checkAccount(any(CheckAccountReq.class))).thenReturn(response);

        // when & then
        mockMvc.perform(post("/accounts/auth/check-account")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bankHolderName").value("홍길동"))
                .andDo(document("Account-Auth/checkAccount",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("bankCode").type(JsonFieldType.STRING).description("은행 코드"),
                                fieldWithPath("accountNumber").type(JsonFieldType.STRING).description("계좌 번호")
                        ),
                        responseFields(
                                fieldWithPath("bankHolderName").type(JsonFieldType.STRING).description("계좌 소유주 이름")
                        )
                ));
    }
}