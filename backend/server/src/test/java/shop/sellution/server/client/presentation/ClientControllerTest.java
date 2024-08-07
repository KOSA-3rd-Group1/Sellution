package shop.sellution.server.client.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import shop.sellution.server.client.application.ClientService;
import shop.sellution.server.client.dto.request.*;
import shop.sellution.server.client.dto.response.FindCurrentClientInfoRes;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.global.type.UserRole;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClientController.class)
class ClientControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ClientService clientService;

    @Test
    @WithMockUser
    @DisplayName("고객 회원가입")
    void registerClient_Success() throws Exception {
        // given
        SaveClientReq request = new SaveClientReq(1L, "testuser", "Password123!", "Test User", "01012345678", Set.of());
        when(clientService.saveClient(any(SaveClientReq.class))).thenReturn(1L);

        // when & then
        mockMvc.perform(post("/clients/signup")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andDo(document("client/register",
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
                                fieldWithPath("id").type(JsonFieldType.NUMBER).description("생성된 고객 ID")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("고객 아이디 중복 확인")
    void checkClientUsername_Success() throws Exception {
        // given
        CheckClientUsernameReq request = new CheckClientUsernameReq();
        ReflectionTestUtils.setField(request, "username", "testuser");

        // when & then
        mockMvc.perform(post("/clients/duplicate-check-id")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(true))
                .andDo(document("client/check-username",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("username").type(JsonFieldType.STRING).description("확인할 사용자명")
                        ),
                        responseFields(
                                fieldWithPath("available").type(JsonFieldType.BOOLEAN).description("사용 가능 여부")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("회원가입 SMS 인증번호 전송")
    void sendSignupSmsAuthNumber_Success() throws Exception {
        // given
        CheckClientPhoneNumberReq request = new CheckClientPhoneNumberReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");

        when(clientService.checkClientPhoneNumber(any(CheckClientPhoneNumberReq.class))).thenReturn(true);

        // when & then
        mockMvc.perform(post("/clients/signup/verify-code/send")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("true"))
                .andDo(document("client/send-signup-sms",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호")
                        ),
                        responseBody()
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("회원가입 SMS 인증번호 확인")
    void verifySignupSmsAuthNumber_Success() throws Exception {
        // given
        FindClientSignupSmsAuthNumberReq request = new FindClientSignupSmsAuthNumberReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
        ReflectionTestUtils.setField(request, "authNumber", "123456");

        when(clientService.verifyClientSmsAuthNumber(any(FindClientSignupSmsAuthNumberReq.class))).thenReturn(true);

        // when & then
        mockMvc.perform(post("/clients/signup/verify-code")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("true"))
                .andDo(document("client/verify-signup-sms",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호"),
                                fieldWithPath("authNumber").type(JsonFieldType.STRING).description("인증번호")
                        ),
                        responseBody()
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("현재 고객 정보 조회")
    void getCurrentUser_Success() throws Exception {
        // given
        FindCurrentClientInfoRes response = FindCurrentClientInfoRes.builder()
                .id(1L)
                .companyId(1L)
                .name("Test User")
                .userRole(UserRole.ROLE_CLIENT)
                .contractCompanyName("Test Company")
                .isAutoApproved(DisplayStatus.Y)
                .build();

        when(clientService.getCurrentUserInfo()).thenReturn(response);

        // when & then
        mockMvc.perform(get("/clients/me")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.name").value("Test User"))
                .andDo(document("client/get-current-user",
                        preprocessResponse(prettyPrint()),
                        responseFields(
                                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("고객 ID"),
                                fieldWithPath("data.companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("data.name").type(JsonFieldType.STRING).description("이름"),
                                fieldWithPath("data.userRole").type(JsonFieldType.STRING).description("사용자 역할"),
                                fieldWithPath("data.contractCompanyName").type(JsonFieldType.STRING).description("계약 회사명"),
                                fieldWithPath("data.isAutoApproved").type(JsonFieldType.STRING).description("자동 승인 여부")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("고객 아이디 찾기")
    void findClientId_Success() throws Exception {
        // given
        FindClientIdReq request = new FindClientIdReq();
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
        ReflectionTestUtils.setField(request, "authNumber", "123456");

        when(clientService.findClientId(any(FindClientIdReq.class))).thenReturn("testuser");

        // when & then
        mockMvc.perform(post("/clients/find-id")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andDo(document("client/find-id",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("name").type(JsonFieldType.STRING).description("이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호"),
                                fieldWithPath("authNumber").type(JsonFieldType.STRING).description("인증번호")
                        ),
                        responseFields(
                                fieldWithPath("username").type(JsonFieldType.STRING).description("찾은 사용자명")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("고객 아이디 찾기 SMS 인증번호 요청")
    void findClientIdSmsAuthNumber_Success() throws Exception {
        // given
        FindClientIdSmsAuthNumberReq request = new FindClientIdSmsAuthNumberReq();
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");

        // when & then
        mockMvc.perform(post("/clients/find-id/send")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value("인증 번호가 성공적으로 발송되었습니다."))
                .andDo(document("client/find-id-send-sms",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("name").type(JsonFieldType.STRING).description("이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호")
                        ),
                        responseFields(
                                fieldWithPath("success").type(JsonFieldType.STRING).description("성공 메시지")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("고객 비밀번호 찾기")
    void findClientPassword_Success() throws Exception {
        // given
        FindClientPasswordReq request = new FindClientPasswordReq();
        ReflectionTestUtils.setField(request, "username", "testuser");
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
        ReflectionTestUtils.setField(request, "authNumber", "123456");

        MockHttpServletRequest httpRequest = new MockHttpServletRequest();
        when(clientService.findClientPassword(any(FindClientPasswordReq.class), any())).thenReturn("resetToken");

        // when & then
        mockMvc.perform(post("/clients/find-password")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("resetToken"))
                .andDo(document("client/find-password",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("username").type(JsonFieldType.STRING).description("사용자명"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호"),
                                fieldWithPath("authNumber").type(JsonFieldType.STRING).description("인증번호")
                        ),
                        responseFields(
                                fieldWithPath("token").type(JsonFieldType.STRING).description("비밀번호 재설정 토큰")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("고객 비밀번호 찾기 SMS 인증번호 요청")
    void findClientPasswordSmsAuthNumber_Success() throws Exception {
        // given
        FindClientPasswordSmsAuthNumberReq request = new FindClientPasswordSmsAuthNumberReq();
        ReflectionTestUtils.setField(request, "username", "testuser");
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");

        // when & then
        mockMvc.perform(post("/clients/find-password/send")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value("인증 번호가 성공적으로 발송되었습니다."))
                .andDo(document("client/find-password-send-sms",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("username").type(JsonFieldType.STRING).description("사용자명"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호")
                        ),
                        responseFields(
                                fieldWithPath("success").type(JsonFieldType.STRING).description("성공 메시지")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("고객 비밀번호 변경")
    void changeClientPassword_Success() throws Exception {
        // given
        ChangeClientPasswordReq request = new ChangeClientPasswordReq();
        ReflectionTestUtils.setField(request, "token", "resetToken");
        ReflectionTestUtils.setField(request, "newPassword", "NewPassword123!");

        MockHttpServletRequest httpRequest = new MockHttpServletRequest();

        // when & then
        mockMvc.perform(post("/clients/change-password")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value("비밀번호가 성공적으로 변경되었습니다."))
                .andDo(document("client/change-password",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("token").type(JsonFieldType.STRING).description("비밀번호 재설정 토큰"),
                                fieldWithPath("newPassword").type(JsonFieldType.STRING).description("새 비밀번호")
                        ),
                        responseFields(
                                fieldWithPath("success").type(JsonFieldType.STRING).description("성공 메시지")
                        )
                ));
    }
}
