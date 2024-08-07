package shop.sellution.server.customer.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.restdocs.request.RequestDocumentation;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import shop.sellution.server.customer.application.CustomerService;
import shop.sellution.server.customer.dto.request.*;
import shop.sellution.server.customer.dto.resonse.FindCurrentCustomerInfoRes;
import shop.sellution.server.customer.dto.resonse.FindCustomerInfoRes;
import shop.sellution.server.customer.dto.resonse.FindCustomerRes;
import shop.sellution.server.customer.domain.type.CustomerType;
import shop.sellution.server.common.BaseControllerTest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomerController.class)
class CustomerControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CustomerService customerService;

    @Test
    @WithMockUser
    @DisplayName("회원 회원가입 성공")
    void signupCustomer_Success() throws Exception {
        SaveCustomerReq request = new SaveCustomerReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "username", "testuser");
        ReflectionTestUtils.setField(request, "password", "password123!");
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");

        when(customerService.saveCustomer(any(SaveCustomerReq.class))).thenReturn(1L);

        mockMvc.perform(post("/api/customers/signup")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andDo(document("customer/signup",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("username").type(JsonFieldType.STRING).description("사용자명"),
                                fieldWithPath("password").type(JsonFieldType.STRING).description("비밀번호"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호")
                        ),
                        responseFields(
                                fieldWithPath("id").type(JsonFieldType.NUMBER).description("생성된 회원 ID")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("회원 아이디 중복 확인 성공")
    void checkCustomerUsername_Success() throws Exception {
        CheckCustomerUsernameReq request = new CheckCustomerUsernameReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "username", "testuser");

        doNothing().when(customerService).checkCustomerUsername(any(CheckCustomerUsernameReq.class));

        mockMvc.perform(post("/api/customers/duplicate-check-id")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(true))
                .andDo(document("customer/check-username",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("username").type(JsonFieldType.STRING).description("확인할 사용자명")
                        ),
                        responseFields(
                                fieldWithPath("available").type(JsonFieldType.BOOLEAN).description("사용 가능 여부")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("회원가입 SMS 인증번호 전송 성공")
    void sendSignupSmsAuthNumber_Success() throws Exception {
        CheckCustomerPhoneNumberReq request = new CheckCustomerPhoneNumberReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");

        when(customerService.checkCustomerPhoneNumber(any(CheckCustomerPhoneNumberReq.class))).thenReturn(true);

        mockMvc.perform(post("/api/customers/signup/verify-code/send")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("true"))
                .andDo(document("customer/send-signup-sms",
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
    @DisplayName("회원가입 SMS 인증번호 확인 성공")
    void verifySignupSmsAuthNumber_Success() throws Exception {
        FindCustomerSignupSmsAuthNumberReq request = new FindCustomerSignupSmsAuthNumberReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
        ReflectionTestUtils.setField(request, "authNumber", "123456");

        when(customerService.verifyCustomerSmsAuthNumber(any(FindCustomerSignupSmsAuthNumberReq.class))).thenReturn(true);

        mockMvc.perform(post("/api/customers/signup/verify-code")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("true"))
                .andDo(document("customer/verify-signup-sms",
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
    @DisplayName("현재 회원 정보 조회 성공")
    void getCurrentCustomerInfo_Success() throws Exception {
        FindCurrentCustomerInfoRes response = new FindCurrentCustomerInfoRes();
        ReflectionTestUtils.setField(response, "id", 1L);
        ReflectionTestUtils.setField(response, "companyId", 1L);
        ReflectionTestUtils.setField(response, "name", "Test User");
        ReflectionTestUtils.setField(response, "customerType", CustomerType.NORMAL);

        when(customerService.getCurrentUserInfo()).thenReturn(response);

        mockMvc.perform(get("/api/customers/me")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.companyId").value(1L))
                .andExpect(jsonPath("$.data.name").value("Test User"))
                .andExpect(jsonPath("$.data.customerType").value("NORMAL"))
                .andDo(document("customer/get-current-user",
                        preprocessResponse(prettyPrint()),
                        responseFields(
                                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("회원 ID"),
                                fieldWithPath("data.companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("data.name").type(JsonFieldType.STRING).description("이름"),
                                fieldWithPath("data.customerType").type(JsonFieldType.STRING).description("회원 유형")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("회원 아이디 찾기 성공")
    void findCustomerId_Success() throws Exception {
        FindCustomerIdReq request = new FindCustomerIdReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
        ReflectionTestUtils.setField(request, "authNumber", "123456");

        when(customerService.findCustomerId(any(FindCustomerIdReq.class))).thenReturn("testuser");

        mockMvc.perform(post("/api/customers/find-id")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andDo(document("customer/find-id",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
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
    @DisplayName("회원 아이디 찾기 SMS 인증번호 요청 성공")
    void findCustomerIdSmsAuthNumber_Success() throws Exception {
        FindCustomerIdSmsAuthNumberReq request = new FindCustomerIdSmsAuthNumberReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");

        doNothing().when(customerService).findCustomerIdSmsAuthNumber(any(FindCustomerIdSmsAuthNumberReq.class));

        mockMvc.perform(post("/api/customers/find-id/send")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value("인증 번호가 성공적으로 발송되었습니다."))
                .andDo(document("customer/find-id-send-sms",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
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
    @DisplayName("회원 비밀번호 찾기 성공")
    void findCustomerPassword_Success() throws Exception {
        FindCustomerPasswordReq request = new FindCustomerPasswordReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "username", "testuser");
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
        ReflectionTestUtils.setField(request, "authNumber", "123456");

        when(customerService.findCustomerPassword(any(FindCustomerPasswordReq.class), any())).thenReturn("token123");

        mockMvc.perform(post("/api/customers/find-password")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token123"))
                .andDo(document("customer/find-password",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
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
    @DisplayName("회원 비밀번호 찾기 SMS 인증번호 요청 성공")
    void findCustomerPasswordSmsAuthNumber_Success() throws Exception {
        FindCustomerPasswordSmsAuthNumberReq request = new FindCustomerPasswordSmsAuthNumberReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "username", "testuser");
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");

        doNothing().when(customerService).findCustomerPasswordSmsAuthNumber(any(FindCustomerPasswordSmsAuthNumberReq.class));

        mockMvc.perform(post("/api/customers/find-password/send")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value("인증 번호가 성공적으로 발송되었습니다."))
                .andDo(document("customer/find-password-send-sms",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
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
    @DisplayName("회원 비밀번호 변경 성공")
    void changeCustomerPassword_Success() throws Exception {
        ChangeCustomerPasswordReq request = new ChangeCustomerPasswordReq();
        ReflectionTestUtils.setField(request, "token", "token123");
        ReflectionTestUtils.setField(request, "newPassword", "newPassword123!");

        doNothing().when(customerService).changeCustomerPassword(any(ChangeCustomerPasswordReq.class), any());

        mockMvc.perform(post("/api/customers/change-password")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value("비밀번호가 성공적으로 변경되었습니다."))
                .andDo(document("customer/change-password",
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

    @Test
    @WithMockUser
    @DisplayName("회원 등록 성공")
    void registerCustomerFromClient_Success() throws Exception {
        RegisterCustomerReq request = new RegisterCustomerReq();
        ReflectionTestUtils.setField(request, "customerName", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");

        FindCustomerRes response = FindCustomerRes.builder()
                .customerId(1L)
                .customerUsername("testuser")
                .customerName("Test User")
                .customerPhoneNumber("01012345678")
                .customerCreatedAt("2023-06-01")
                .customerType(CustomerType.NEW)
                .latestDeliveryDate(null)
                .build();

        when(customerService.registerCustomerFromClient(any(RegisterCustomerReq.class))).thenReturn(response);

        mockMvc.perform(RestDocumentationRequestBuilders.post("/api/customers/self")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerId").value(1))
                .andDo(document("customer/register-from-client",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("customerName").type(JsonFieldType.STRING).description("회원 이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호")
                        ),
                        responseFields(
                                fieldWithPath("customerId").type(JsonFieldType.NUMBER).description("회원 ID"),
                                fieldWithPath("customerUsername").type(JsonFieldType.STRING).description("사용자명"),
                                fieldWithPath("customerName").type(JsonFieldType.STRING).description("회원 이름"),
                                fieldWithPath("customerPhoneNumber").type(JsonFieldType.STRING).description("전화번호"),
                                fieldWithPath("customerCreatedAt").type(JsonFieldType.STRING).description("생성일"),
                                fieldWithPath("customerType").type(JsonFieldType.STRING).description("회원 유형"),
                                fieldWithPath("latestDeliveryDate").type(JsonFieldType.NULL).description("최근 배송일")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("회원 정보 조회 성공")
    void findCustomerById_Success() throws Exception {
        FindCustomerRes response = FindCustomerRes.builder()
                .customerId(1L)
                .customerUsername("testuser")
                .customerName("Test User")
                .customerPhoneNumber("01012345678")
                .customerCreatedAt("2023-06-01")
                .customerType(CustomerType.NORMAL)
                .build();

        when(customerService.getCustomerById(1L)).thenReturn(response);

        mockMvc.perform(RestDocumentationRequestBuilders.get("/api/customers/{id}", 1L)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerId").value(1))
                .andExpect(jsonPath("$.customerUsername").value("testuser"))
                .andExpect(jsonPath("$.customerName").value("Test User"))
                .andExpect(jsonPath("$.customerPhoneNumber").value("01012345678"))
                .andExpect(jsonPath("$.customerCreatedAt").value("2023-06-01"))
                .andExpect(jsonPath("$.customerType").value("NORMAL"))
                .andDo(document("customer/find-by-id",
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("id").description("회원 ID")
                        ),
                        responseFields(
                                fieldWithPath("customerId").type(JsonFieldType.NUMBER).description("회원 ID"),
                                fieldWithPath("customerUsername").type(JsonFieldType.STRING).description("사용자명"),
                                fieldWithPath("customerName").type(JsonFieldType.STRING).description("회원 이름"),
                                fieldWithPath("customerPhoneNumber").type(JsonFieldType.STRING).description("전화번호"),
                                fieldWithPath("customerCreatedAt").type(JsonFieldType.STRING).description("생성일"),
                                fieldWithPath("customerType").type(JsonFieldType.STRING).description("회원 유형"),
                                fieldWithPath("latestDeliveryDate").type(JsonFieldType.NULL).description("최근 배송일")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("회원 정보 수정 성공")
    void updateCustomer_Success() throws Exception {
        RegisterCustomerReq request = new RegisterCustomerReq();
        ReflectionTestUtils.setField(request, "customerName", "Updated User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01087654321");

        doNothing().when(customerService).updateCustomer(eq(1L), any(RegisterCustomerReq.class));

        mockMvc.perform(RestDocumentationRequestBuilders.put("/api/customers/{id}", 1L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("customer/update",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("id").description("회원 ID")
                        ),
                        requestFields(
                                fieldWithPath("customerName").type(JsonFieldType.STRING).description("수정할 회원 이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("수정할 전화번호")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("마이페이지 회원 정보 조회 성공")
    void getCustomerInfo_Success() throws Exception {
        FindCustomerInfoRes response = FindCustomerInfoRes.builder()
                .name("Test User")
                .customerType(CustomerType.NORMAL)
                .build();

        when(customerService.getCustomerInfo(1L)).thenReturn(response);

        mockMvc.perform(RestDocumentationRequestBuilders.get("/api/customers/mypage/{id}", 1L)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test User"))
                .andExpect(jsonPath("$.customerType").value("NORMAL"))
                .andDo(document("customer/get-info",
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("id").description("회원 ID")
                        ),
                        responseFields(
                                fieldWithPath("name").type(JsonFieldType.STRING).description("회원 이름"),
                                fieldWithPath("customerType").type(JsonFieldType.STRING).description("회원 유형")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("인증 코드 전송 성공")
    void sendAuthenticationCode_Success() throws Exception {
        SendAuthCodeReq request = new SendAuthCodeReq();
        ReflectionTestUtils.setField(request, "customerId", 1L);
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");

        doNothing().when(customerService).sendAuthenticationCode(eq(1L), eq("Test User"), eq("01012345678"));

        mockMvc.perform(post("/api/customers/{id}/send-auth-code", 1L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andDo(document("customer/send-auth-code",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("id").description("회원 ID")
                        ),
                        requestFields(
                                fieldWithPath("customerId").type(JsonFieldType.NUMBER).description("회원 ID"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("회원 이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호")
                        )
                ));
    }

    @Test
    @WithMockUser
    @DisplayName("인증 코드 확인 성공")
    void verifyAuthenticationCode_Success() throws Exception {
        VerifyAuthCodeReq request = new VerifyAuthCodeReq();
        ReflectionTestUtils.setField(request, "customerId", 1L);
        ReflectionTestUtils.setField(request, "authCode", "123456");

        doNothing().when(customerService).verifyAuthenticationCode(eq(1L), eq("123456"));

        mockMvc.perform(RestDocumentationRequestBuilders.post("/api/customers/{id}/verify-auth-code", 1L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andDo(document("customer/verify-auth-code",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("id").description("회원 ID")
                        ),
                        requestFields(
                                fieldWithPath("customerId").type(JsonFieldType.NUMBER).description("회원 ID"),
                                fieldWithPath("authCode").type(JsonFieldType.STRING).description("인증 코드")
                        )
                ));
    }
}
