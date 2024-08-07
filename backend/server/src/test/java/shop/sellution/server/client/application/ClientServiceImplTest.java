package shop.sellution.server.client.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import shop.sellution.server.auth.dto.CustomUserDetails;
import shop.sellution.server.client.domain.Client;
import shop.sellution.server.client.domain.ClientRepository;
import shop.sellution.server.client.dto.request.*;
import shop.sellution.server.client.dto.response.FindCurrentClientInfoRes;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.contractcompany.domain.ContractCompany;
import shop.sellution.server.contractcompany.domain.ContractCompanyRepository;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.global.type.UserRole;
import shop.sellution.server.sms.application.SmsAuthNumberService;
import shop.sellution.server.sms.dto.request.SendSmsAuthNumberReq;
import shop.sellution.server.sms.dto.request.VerifySmsAuthNumberReq;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static shop.sellution.server.contractcompany.domain.QContractCompany.contractCompany;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ClientServiceImplTest {

    @InjectMocks
    private ClientServiceImpl clientService;

    @Mock
    private ClientRepository clientRepository;
    @Mock
    private CompanyRepository companyRepository;
    @Mock
    private ContractCompanyRepository contractCompanyRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private SmsAuthNumberService smsAuthNumberService;
    @Mock
    private RedisTemplate<String, String> redisTemplate;
    @Mock
    private ValueOperations<String, String> valueOperations;
    @Mock
    private HttpServletRequest httpRequest;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;
    @Mock
    private ContractCompany contractCompany;

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    @DisplayName("고객 회원가입 성공")
    void saveClient_Success() {
        // Given
        SaveClientReq request = new SaveClientReq(1L, "testuser", "password", "Test User", "01012345678", Set.of());
        Company company = new Company();
        Client client = new Client(company, "testuser", "encodedPassword", "Test User", "01012345678");
        ReflectionTestUtils.setField(client, "id", 1L);  // ID 설정

        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(clientRepository.existsByUsername("testuser")).thenReturn(false);
        when(clientRepository.existsByPhoneNumber("01012345678")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(clientRepository.save(any(Client.class))).thenReturn(client);

        // When
        Long result = clientService.saveClient(request);

        // Then
        assertNotNull(result);
        assertEquals(1L, result);
        verify(clientRepository).save(any(Client.class));
    }

    @Test
    @DisplayName("고객 회원가입 실패 - 중복된 사용자명")
    void saveClient_Failure_DuplicateUsername() {
        // Given
        SaveClientReq request = new SaveClientReq(1L, "testuser", "password", "Test User", "01012345678", Set.of());
        when(clientRepository.existsByUsername("testuser")).thenReturn(true);

        // When & Then
        assertThrows(BadRequestException.class, () -> clientService.saveClient(request));
    }

    @Test
    @DisplayName("고객 아이디 중복 확인 성공")
    void checkClientUsername_Success() {
        // Given
        CheckClientUsernameReq request = new CheckClientUsernameReq();
        ReflectionTestUtils.setField(request, "username", "newuser");

//        request.setUsername("newuser");
        when(clientRepository.existsByUsername("newuser")).thenReturn(false);

        // When & Then
        assertDoesNotThrow(() -> clientService.checkClientUsername(request));
    }

    @Test
    @DisplayName("고객 아이디 중복 확인 실패")
    void checkClientUsername_Failure() {
        // Given
        CheckClientUsernameReq request = new CheckClientUsernameReq();
        ReflectionTestUtils.setField(request, "username", "existinguser");

//        request.setUsername("existinguser");
        when(clientRepository.existsByUsername("existinguser")).thenReturn(true);

        // When & Then
        assertThrows(BadRequestException.class, () -> clientService.checkClientUsername(request));
    }

    @Test
    @DisplayName("고객 전화번호 확인 성공")
    void checkClientPhoneNumber_Success() {
        // Given
        CheckClientPhoneNumberReq request = new CheckClientPhoneNumberReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");

//        request.setCompanyId(1L);
//        request.setPhoneNumber("01012345678");
        when(clientRepository.existsByPhoneNumber("01012345678")).thenReturn(false);

        // When
        Boolean result = clientService.checkClientPhoneNumber(request);

        // Then
        assertTrue(result);
        verify(smsAuthNumberService).sendSmsAuthNumber(any(SendSmsAuthNumberReq.class));
    }

    @Test
    @DisplayName("고객 전화번호 확인 실패 - 중복된 전화번호")
    void checkClientPhoneNumber_Failure_DuplicatePhoneNumber() {
        // Given
        CheckClientPhoneNumberReq request = new CheckClientPhoneNumberReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
//        request.setCompanyId(1L);
//        request.setPhoneNumber("01012345678");
        when(clientRepository.existsByPhoneNumber("01012345678")).thenReturn(true);

        // When & Then
        assertThrows(BadRequestException.class, () -> clientService.checkClientPhoneNumber(request));
    }

    @Test
    @DisplayName("고객 회원가입 SMS 인증번호 확인 성공")
    void verifyClientSmsAuthNumber_Success() {
        // Given
        FindClientSignupSmsAuthNumberReq request = new FindClientSignupSmsAuthNumberReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
        ReflectionTestUtils.setField(request, "authNumber", "123456");

//        request.setCompanyId(1L);
//        request.setPhoneNumber("01012345678");
//        request.setAuthNumber("123456");
        when(clientRepository.existsByPhoneNumber("01012345678")).thenReturn(false);

        // When
        Boolean result = clientService.verifyClientSmsAuthNumber(request);

        // Then
        assertTrue(result);
        verify(smsAuthNumberService).verifySmsAuthNumber(any(VerifySmsAuthNumberReq.class));
    }

    @Test
    @DisplayName("현재 고객 정보 조회 성공")
    void getCurrentUserInfo_Success() {
        // Given
        Client client = new Client(new Company(), "testuser", "password", "Test User", "01012345678");
        client.getCompany().setCompanyId(1L);
        client.getCompany().setIsAutoApproved(DisplayStatus.Y);

        when(contractCompany.getContractCompanyName()).thenReturn("Test Company");

//        CustomUserDetails userDetails = new CustomUserDetails(client);
        CustomUserDetails userDetails = new CustomUserDetails(
                client.getId(),
                client.getCompany().getCompanyId(),
                client.getUsername(),
                client.getName(),
                Collections.singletonList(client.getUserRole().name())
        );
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(clientRepository.findByUsername("testuser")).thenReturn(Optional.of(client));
        when(contractCompanyRepository.findByCompany_companyId(1L)).thenReturn(Optional.of(contractCompany));

        // When
        FindCurrentClientInfoRes result = clientService.getCurrentUserInfo();

        // Then
        assertNotNull(result);
        assertEquals("Test User", result.getName());
        assertEquals("Test Company", result.getContractCompanyName());
        assertEquals(DisplayStatus.Y, result.getIsAutoApproved());
    }

    @Test
    @DisplayName("고객 아이디 찾기 성공")
    void findClientId_Success() {
        // Given
        FindClientIdReq request = new FindClientIdReq();
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
        ReflectionTestUtils.setField(request, "authNumber", "123456");
//        request.setName("Test User");
//        request.setPhoneNumber("01012345678");
//        request.setAuthNumber("123456");

        Client client = new Client(new Company(), "testuser", "password", "Test User", "01012345678");
        when(clientRepository.findByPhoneNumber("01012345678")).thenReturn(Optional.of(client));

        // When
        String result = clientService.findClientId(request);

        // Then
        assertEquals("testuser", result);
        verify(smsAuthNumberService).verifySmsAuthNumber(any(VerifySmsAuthNumberReq.class));
    }

    @Test
    @DisplayName("고객 아이디 찾기 SMS 인증번호 요청 성공")
    void findClientIdSmsAuthNumber_Success() {
        // Given
        FindClientIdSmsAuthNumberReq request = new FindClientIdSmsAuthNumberReq();
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
//        request.setName("Test User");
//        request.setPhoneNumber("01012345678");

        Client client = new Client(new Company(), "testuser", "password", "Test User", "01012345678");
        when(clientRepository.findByPhoneNumber("01012345678")).thenReturn(Optional.of(client));

        // When & Then
        assertDoesNotThrow(() -> clientService.findClientIdSmsAuthNumber(request));
        verify(smsAuthNumberService).sendSmsAuthNumber(any(SendSmsAuthNumberReq.class));
    }

    @Test
    @DisplayName("고객 비밀번호 찾기 성공")
    void findClientPassword_Success() {
        // Given
        FindClientPasswordReq request = new FindClientPasswordReq();
        ReflectionTestUtils.setField(request, "username", "testuser");
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
        ReflectionTestUtils.setField(request, "authNumber", "123456");

//        request.setUsername("testuser");
//        request.setName("Test User");
//        request.setPhoneNumber("01012345678");
//        request.setAuthNumber("123456");

        Client client = new Client(new Company(), "testuser", "password", "Test User", "01012345678");
        when(clientRepository.findByUsername("testuser")).thenReturn(Optional.of(client));
        when(httpRequest.getHeader("X-Forwarded-For")).thenReturn("127.0.0.1");

        // When
        String result = clientService.findClientPassword(request, httpRequest);

        // Then
        assertNotNull(result);
        verify(smsAuthNumberService).verifySmsAuthNumber(any(VerifySmsAuthNumberReq.class));
        verify(redisTemplate.opsForValue()).set(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("고객 비밀번호 찾기 SMS 인증번호 요청 성공")
    void findClientPasswordSmsAuthNumber_Success() {
        // Given
        FindClientPasswordSmsAuthNumberReq request = new FindClientPasswordSmsAuthNumberReq();
        ReflectionTestUtils.setField(request, "username", "testuser");
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
//        ReflectionTestUtils.setField(request, "authNumber", "123456");
//        request.setUsername("testuser");
//        request.setName("Test User");
//        request.setPhoneNumber("01012345678");

        Client client = new Client(new Company(), "testuser", "password", "Test User", "01012345678");
        when(clientRepository.findByUsername("testuser")).thenReturn(Optional.of(client));

        // When & Then
        assertDoesNotThrow(() -> clientService.findClientPasswordSmsAuthNumber(request));
        verify(smsAuthNumberService).sendSmsAuthNumber(any(SendSmsAuthNumberReq.class));
    }

    @Test
    @DisplayName("고객 비밀번호 변경 성공")
    void changeClientPassword_Success() {
        // Given
        ChangeClientPasswordReq request = new ChangeClientPasswordReq();
        ReflectionTestUtils.setField(request, "token", "validToken");
        ReflectionTestUtils.setField(request, "newPassword", "newPassword123");

//        request.setToken("validToken");
//        request.setNewPassword("newPassword123");

        Client client = new Client(new Company(), "testuser", "oldPassword", "Test User", "01012345678");
        when(redisTemplate.opsForValue().get(anyString())).thenReturn("1:0");
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(passwordEncoder.encode("newPassword123")).thenReturn("encodedNewPassword");
        when(httpRequest.getHeader("X-Forwarded-For")).thenReturn("127.0.0.1");

        // When
        clientService.changeClientPassword(request, httpRequest);

        // Then
        verify(clientRepository).save(client);
        assertEquals("encodedNewPassword", client.getPassword());
    }

    @Test
    @DisplayName("고객 비밀번호 변경 실패 - 유효하지 않은 토큰")
    void changeClientPassword_Failure_InvalidToken() {
        // Given
        ChangeClientPasswordReq request = new ChangeClientPasswordReq();
        ReflectionTestUtils.setField(request, "token", "invalidToken");
        ReflectionTestUtils.setField(request, "newPassword", "newPassword123");
//        request.setToken("invalidToken");
//        request.setNewPassword("newPassword123");

        when(redisTemplate.opsForValue().get(anyString())).thenReturn(null);
        when(httpRequest.getHeader("X-Forwarded-For")).thenReturn("127.0.0.1");

        // When & Then
        assertThrows(AuthException.class, () -> clientService.changeClientPassword(request, httpRequest));
    }

    @Test
    @DisplayName("고객 비밀번호 변경 실패 - 시도 횟수 초과")
    void changeClientPassword_Failure_ExceededAttempts() {
        // Given
        ChangeClientPasswordReq request = new ChangeClientPasswordReq();
        ReflectionTestUtils.setField(request, "token", "validToken");
        ReflectionTestUtils.setField(request, "newPassword", "newPassword123");
//        request.setToken("validToken");
//        request.setNewPassword("newPassword123");

        when(redisTemplate.opsForValue().get(anyString())).thenReturn("1:3");
        when(httpRequest.getHeader("X-Forwarded-For")).thenReturn("127.0.0.1");

        // When & Then
        assertThrows(AuthException.class, () -> clientService.changeClientPassword(request, httpRequest));
        verify(redisTemplate).delete(anyString());
    }

    @Test
    @DisplayName("고객 비밀번호 변경 실패 - 이전 비밀번호와 동일")
    void changeClientPassword_Failure_SameAsOldPassword() {
        // Given
        ChangeClientPasswordReq request = new ChangeClientPasswordReq();
        ReflectionTestUtils.setField(request, "token", "validToken");
        ReflectionTestUtils.setField(request, "newPassword", "oldPassword");
//        request.setToken("validToken");
//        request.setNewPassword("oldPassword");

        Client client = new Client(new Company(), "testuser", "encodedOldPassword", "Test User", "01012345678");
        when(redisTemplate.opsForValue().get(anyString())).thenReturn("1:0");
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(passwordEncoder.matches("oldPassword", "encodedOldPassword")).thenReturn(true);
        when(httpRequest.getHeader("X-Forwarded-For")).thenReturn("127.0.0.1");

        // When & Then
        assertThrows(AuthException.class, () -> clientService.changeClientPassword(request, httpRequest));
        verify(redisTemplate.opsForValue()).set(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("고객 정보 조회 실패 - 존재하지 않는 사용자")
    void getCurrentUserInfo_Failure_UserNotFound() {
        // Given
        CustomUserDetails userDetails = mock(CustomUserDetails.class);
        when(userDetails.getUsername()).thenReturn("nonexistentuser");
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(clientRepository.findByUsername("nonexistentuser")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(AuthException.class, () -> clientService.getCurrentUserInfo());
    }

    @Test
    @DisplayName("고객 아이디 찾기 실패 - 잘못된 이름")
    void findClientId_Failure_InvalidName() {
        // Given
        FindClientIdReq request = new FindClientIdReq();
        ReflectionTestUtils.setField(request, "name", "Wrong Name");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
        ReflectionTestUtils.setField(request, "authNumber", "123456");
//        request.setName("Wrong Name");
//        request.setPhoneNumber("01012345678");
//        request.setAuthNumber("123456");

        Client client = new Client(new Company(), "testuser", "password", "Test User", "01012345678");
        when(clientRepository.findByPhoneNumber("01012345678")).thenReturn(Optional.of(client));

        // When & Then
        assertThrows(BadRequestException.class, () -> clientService.findClientId(request));
    }

    @Test
    @DisplayName("고객 비밀번호 찾기 실패 - 잘못된 전화번호")
    void findClientPassword_Failure_InvalidPhoneNumber() {
        // Given
        FindClientPasswordReq request = new FindClientPasswordReq();
        ReflectionTestUtils.setField(request, "username", "testuser");
        ReflectionTestUtils.setField(request, "name", "Test User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01087654321");
        ReflectionTestUtils.setField(request, "authNumber", "123456");
//        request.setUsername("testuser");
//        request.setName("Test User");
//        request.setPhoneNumber("01087654321");
//        request.setAuthNumber("123456");

        Client client = new Client(new Company(), "testuser", "password", "Test User", "01012345678");
        when(clientRepository.findByUsername("testuser")).thenReturn(Optional.of(client));

        // When & Then
        assertThrows(BadRequestException.class, () -> clientService.findClientPassword(request, httpRequest));
    }

    @Test
    @DisplayName("고객 전화번호 확인 실패 - SMS 발송 실패")
    void checkClientPhoneNumber_Failure_SmsSendingFailed() {
        // Given
        CheckClientPhoneNumberReq request = new CheckClientPhoneNumberReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
//        request.setCompanyId(1L);
//        request.setPhoneNumber("01012345678");
        when(clientRepository.existsByPhoneNumber("01012345678")).thenReturn(false);
        doThrow(new RuntimeException("SMS sending failed")).when(smsAuthNumberService).sendSmsAuthNumber(any(SendSmsAuthNumberReq.class));

        // When & Then
        assertThrows(RuntimeException.class, () -> clientService.checkClientPhoneNumber(request));
    }

    @Test
    @DisplayName("고객 회원가입 SMS 인증번호 확인 실패 - 잘못된 인증번호")
    void verifyClientSmsAuthNumber_Failure_InvalidAuthNumber() {
        // Given
        FindClientSignupSmsAuthNumberReq request = new FindClientSignupSmsAuthNumberReq();
        ReflectionTestUtils.setField(request, "companyId", 1L);
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
        ReflectionTestUtils.setField(request, "authNumber", "654321");

//        request.setCompanyId(1L);
//        request.setPhoneNumber("01012345678");
//        request.setAuthNumber("654321");
        when(clientRepository.existsByPhoneNumber("01012345678")).thenReturn(false);
        doThrow(new BadRequestException(ExceptionCode.INVALID_SMS_AUTH)).when(smsAuthNumberService).verifySmsAuthNumber(any(VerifySmsAuthNumberReq.class));

        // When & Then
        assertThrows(BadRequestException.class, () -> clientService.verifyClientSmsAuthNumber(request));
    }

    @Test
    @DisplayName("고객 아이디 찾기 SMS 인증번호 요청 실패 - 존재하지 않는 사용자")
    void findClientIdSmsAuthNumber_Failure_UserNotFound() {
        // Given
        FindClientIdSmsAuthNumberReq request = new FindClientIdSmsAuthNumberReq();
        ReflectionTestUtils.setField(request, "name", "Nonexistent User");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");

//        request.setName("Nonexistent User");
//        request.setPhoneNumber("01012345678");
        when(clientRepository.findByPhoneNumber("01012345678")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(BadRequestException.class, () -> clientService.findClientIdSmsAuthNumber(request));
    }

    @Test
    @DisplayName("고객 비밀번호 찾기 SMS 인증번호 요청 실패 - 잘못된 사용자 정보")
    void findClientPasswordSmsAuthNumber_Failure_InvalidUserInfo() {
        // Given
        FindClientPasswordSmsAuthNumberReq request = new FindClientPasswordSmsAuthNumberReq();
        ReflectionTestUtils.setField(request, "username", "testuser");
        ReflectionTestUtils.setField(request, "name", "Wrong Name");
        ReflectionTestUtils.setField(request, "phoneNumber", "01012345678");
//        request.setUsername("testuser");
//        request.setName("Wrong Name");
//        request.setPhoneNumber("01012345678");

        Client client = new Client(new Company(), "testuser", "password", "Test User", "01012345678");
        when(clientRepository.findByUsername("testuser")).thenReturn(Optional.of(client));

        // When & Then
        assertThrows(BadRequestException.class, () -> clientService.findClientPasswordSmsAuthNumber(request));
    }

    @Test
    @DisplayName("고객 회원가입 실패 - 존재하지 않는 회사")
    void saveClient_Failure_CompanyNotFound() {
        // Given
        SaveClientReq request = new SaveClientReq(999L, "testuser", "password", "Test User", "01012345678", Set.of());
        when(companyRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(BadRequestException.class, () -> clientService.saveClient(request));
    }

    @Test
    @DisplayName("고객 정보 조회 실패 - 계약 회사 정보 없음")
    void getCurrentUserInfo_Failure_ContractCompanyNotFound() {
        // Given
        Client client = new Client(new Company(), "testuser", "password", "Test User", "01012345678");
        client.getCompany().setCompanyId(1L);

//        CustomUserDetails userDetails = new CustomUserDetails(client);
        CustomUserDetails userDetails = new CustomUserDetails(
                client.getId(),
                client.getCompany().getCompanyId(),
                client.getUsername(),
                client.getName(),
                Collections.singletonList(client.getUserRole().name())
        );
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(clientRepository.findByUsername("testuser")).thenReturn(Optional.of(client));
        when(contractCompanyRepository.findByCompany_companyId(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(BadRequestException.class, () -> clientService.getCurrentUserInfo());
    }
}
