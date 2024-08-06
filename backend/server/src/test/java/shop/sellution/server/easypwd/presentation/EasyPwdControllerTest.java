package shop.sellution.server.easypwd.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.easypwd.application.EasyPwdService;
import shop.sellution.server.easypwd.dto.request.EasyPwdReq;
import shop.sellution.server.global.exception.BadRequestException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EasyPwdController.class)
class EasyPwdControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EasyPwdService easyPwdService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    @DisplayName("간편 비밀번호 등록 성공")
    void registerEasyPwd_Success() throws Exception {
        // Given
        Long customerId = 1L;
        EasyPwdReq req = new EasyPwdReq();
        req.setPassword("123456");

        // When & Then
        mockMvc.perform(post("/easy-pwd/customer/{customerId}", customerId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Easy-pwd/register",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("customerId").description("고객 ID")
                        ),
                        requestFields(
                                fieldWithPath("password").type(JsonFieldType.STRING).description("간편 비밀번호")
                        )
                ));

        verify(easyPwdService).registerEasyPwd(eq(customerId), any(EasyPwdReq.class));
    }

    @Test
    @WithMockUser
    @DisplayName("간편 비밀번호 검증 성공")
    void verifyEasyPwd_Success() throws Exception {
        // Given
        Long customerId = 1L;
        EasyPwdReq req = new EasyPwdReq();
        req.setPassword("123456");

        // When & Then
        mockMvc.perform(post("/easy-pwd/customer/{customerId}/verify", customerId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Easy-pwd/verify",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("customerId").description("고객 ID")
                        ),
                        requestFields(
                                fieldWithPath("password").type(JsonFieldType.STRING).description("간편 비밀번호")
                        )
                ));

        verify(easyPwdService).verifyEasyPwd(eq(customerId), any(EasyPwdReq.class));
    }

    @Test
    @WithMockUser
    @DisplayName("간편 비밀번호 확인 - 존재함")
    void checkEasyPwd_Exists() throws Exception {
        // Given
        Long customerId = 1L;
        when(easyPwdService.checkEasyPwd(customerId)).thenReturn(true);

        // When & Then
        mockMvc.perform(get("/easy-pwd/customer/{customerId}/check", customerId)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("true"))
                .andDo(document("Easy-pwd/check",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("customerId").description("고객 ID")
                        )
                ));
    }
}