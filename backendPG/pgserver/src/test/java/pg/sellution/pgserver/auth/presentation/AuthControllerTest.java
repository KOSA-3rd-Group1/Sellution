package pg.sellution.pgserver.auth.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;
import pg.sellution.pgserver.auth.application.AccessTokenService;
import pg.sellution.pgserver.auth.dto.request.CreateTokenReq;
import pg.sellution.pgserver.common.BaseControllerTest;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.headers.HeaderDocumentation.headerWithName;
import static org.springframework.restdocs.headers.HeaderDocumentation.responseHeaders;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest extends BaseControllerTest {

    @MockBean
    private AccessTokenService accessTokenService;

    private ObjectMapper objectMapper = new ObjectMapper();


    @DisplayName("일회용결제토큰을 생성한다.")
    @Test
    void createOneTimePaymentToken_Success() throws Exception {
        // given
        CreateTokenReq req = CreateTokenReq.builder()
                .name("길재현")
                .apiKey("testAPIkey")
                .permission("payment")
                .price(10000)
                .build();
        String expectedToken = "testToken";

        when(accessTokenService.generateToken(
                eq(req.getName()),
                eq(req.getApiKey()),
                eq(req.getPermission()),
                eq(req.getPrice()),
                anyString()
        )).thenReturn(expectedToken);

        // when
        ResultActions result = mockMvc.perform(post("/pg/get-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)));

        // then

        result.andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andExpect(header().string("Authorization", "Bearer " + expectedToken))
                .andDo(document("Auth/create-token",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("name").description("클라이언트 이름"),
                                fieldWithPath("apiKey").description("API 키"),
                                fieldWithPath("permission").description("권한"),
                                fieldWithPath("price").description("가격"),
                                fieldWithPath("clientIp").ignored()
                        ),
                        responseHeaders(
                                headerWithName("Authorization").description("생성된 액세스 토큰")
                        )
                ));
    }

}