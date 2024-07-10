package shop.sellution.server.client.present;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import shop.sellution.server.client.application.ClientServiceImpl;
import shop.sellution.server.client.domain.type.PermissionType;
import shop.sellution.server.client.dto.request.SaveClientReq;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClientController.class)
class ClientControllerTest extends BaseControllerTest {

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ClientServiceImpl clientService;

    @DisplayName("클라이언트를 등록한다")
    @Test
    void registerClient_Success() throws Exception {

        // given
        SaveClientReq request = new SaveClientReq(
                1L,
                "testuser",
                "password123!",
                "Test User",
                "010-1234-5678",
                Set.of(PermissionType.CUSTOMER_MANAGEMENT, PermissionType.ORDER_MANAGEMENT)
        );

        when(clientService.saveClient(any(SaveClientReq.class))).thenReturn(1L);

        // when & then
        mockMvc.perform(post("/api/clients/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andDo(document("Client/register-success",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("username").type(JsonFieldType.STRING).description("사용자명"),
                                fieldWithPath("password").type(JsonFieldType.STRING).description("비밀번호"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호"),
                                fieldWithPath("permissions").type(JsonFieldType.ARRAY).description("권한 목록")
                        ),
                        responseFields(
                                fieldWithPath("id").type(JsonFieldType.NUMBER).description("생성된 클라이언트 ID")
                        )
                ));
    }

    @DisplayName("잘못된 입력으로 클라이언트 등록에 실패한다")
    @Test
    void registerClient_InvalidInput_Failure() throws Exception {

        // given
        SaveClientReq request = new SaveClientReq(
                1L,
                "", // 빈 문자열로 설정하여 유효성 검사 실패 유도
                "short", // 짧은 비밀번호로 설정하여 유효성 검사 실패 유도
                "Test User",
                "invalid-phone", // 잘못된 전화번호 형식으로 설정
                Set.of(PermissionType.CUSTOMER_MANAGEMENT, PermissionType.ORDER_MANAGEMENT)
        );

        // when & then
        mockMvc.perform(post("/api/clients/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andDo(document("Client/register-invalid-input",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("username").type(JsonFieldType.STRING).description("사용자명 (빈 문자열)"),
                                fieldWithPath("password").type(JsonFieldType.STRING).description("비밀번호 (짧은 비밀번호)"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호 (잘못된 형식)"),
                                fieldWithPath("permissions").type(JsonFieldType.ARRAY).description("권한 목록")
                        ),
                        responseFields(
                                fieldWithPath("code").type(JsonFieldType.NUMBER).description("에러 코드"),
                                fieldWithPath("message").type(JsonFieldType.STRING).description("에러 메시지")
                        )
                ));
    }

    @DisplayName("중복된 사용자명으로 클라이언트 등록에 실패한다")
    @Test
    void registerClient_DuplicateUsername_Failure() throws Exception {

        // given
        SaveClientReq request = new SaveClientReq(
                1L,
                "existinguser",
                "password123!",
                "Test User",
                "010-1234-5678",
                Set.of(PermissionType.CUSTOMER_MANAGEMENT, PermissionType.ORDER_MANAGEMENT)
        );

        when(clientService.saveClient(any(SaveClientReq.class)))
                .thenThrow(new BadRequestException(ExceptionCode.DUPLICATED_USERNAME));

        // when & then
        mockMvc.perform(post("/api/clients/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ExceptionCode.DUPLICATED_USERNAME.getCode()))
                .andExpect(jsonPath("$.message").value(ExceptionCode.DUPLICATED_USERNAME.getMessage()))
                .andDo(document("Client/register-duplicate-username",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("username").type(JsonFieldType.STRING).description("사용자명 (중복된 사용자명)"),
                                fieldWithPath("password").type(JsonFieldType.STRING).description("비밀번호"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호"),
                                fieldWithPath("permissions").type(JsonFieldType.ARRAY).description("권한 목록")
                        ),
                        responseFields(
                                fieldWithPath("code").type(JsonFieldType.NUMBER).description("에러 코드"),
                                fieldWithPath("message").type(JsonFieldType.STRING).description("에러 메시지")
                        )
                ));
    }
}
