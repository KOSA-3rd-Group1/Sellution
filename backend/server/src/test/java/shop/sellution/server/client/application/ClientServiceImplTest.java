package shop.sellution.server.client.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import shop.sellution.server.client.domain.Client;
import shop.sellution.server.client.domain.ClientRepository;
import shop.sellution.server.client.domain.type.PermissionType;
import shop.sellution.server.client.dto.request.SaveClientReq;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.global.exception.BadRequestException;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceImplTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private ClientServiceImpl clientService;

    private SaveClientReq validRequest;
    private Company validCompany;

    @BeforeEach
    void setUp() {

        validRequest = new SaveClientReq(
                1L,
                "testuser",
                "password123!",
                "Test User",
                "010-1234-5678",
                Set.of(PermissionType.CUSTOMER_MANAGEMENT, PermissionType.ORDER_MANAGEMENT)
        );

        validCompany = Company.builder()
                .displayName("Test Company")
                .name("Test-Company-1234")
                .build();
        ReflectionTestUtils.setField(validCompany, "companyId", 1L);
    }

    @DisplayName("유효한 요청으로 클라이언트 저장 성공")
    @Test
    void saveClient_ValidRequest_Success() {

        // given
        when(clientRepository.existsByUsername(anyString())).thenReturn(false);
        when(clientRepository.existsByPhoneNumber(anyString())).thenReturn(false);
        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(validCompany));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(clientRepository.save(any(Client.class))).thenAnswer(invocation -> {
            Client savedClient = invocation.getArgument(0);
            ReflectionTestUtils.setField(savedClient, "id", 1L);

            return savedClient;
        });

        // when
        Long savedClientId = clientService.saveClient(validRequest);

        // then
        assertNotNull(savedClientId);
        assertEquals(1L, savedClientId);
        verify(clientRepository).save(any(Client.class));
    }

    @DisplayName("중복된 사용자명으로 클라이언트 저장 실패")
    @Test
    void saveClient_DuplicateUsername_ThrowsException() {

        // given
        when(clientRepository.existsByUsername(anyString())).thenReturn(true);

        // when & then
        assertThrows(BadRequestException.class,
                () -> clientService.saveClient(validRequest));
    }

    @DisplayName("중복된 전화번호로 클라이언트 저장 실패")
    @Test
    void saveClient_DuplicatePhoneNumber_ThrowsException() {

        // given
        when(clientRepository.existsByUsername(anyString())).thenReturn(false);
        when(clientRepository.existsByPhoneNumber(anyString())).thenReturn(true);

        // when & then
        assertThrows(BadRequestException.class,
                () -> clientService.saveClient(validRequest));
    }

    @DisplayName("존재하지 않는 회사 ID로 클라이언트 저장 실패")
    @Test
    void saveClient_NonExistentCompanyId_ThrowsException() {

        // given
        when(clientRepository.existsByUsername(anyString())).thenReturn(false);
        when(clientRepository.existsByPhoneNumber(anyString())).thenReturn(false);
        when(companyRepository.findById(anyLong())).thenReturn(Optional.empty());

        // when & then
        assertThrows(BadRequestException.class,
                () -> clientService.saveClient(validRequest));
    }

    @DisplayName("권한 설정 확인")
    @Test
    void saveClient_SetsPermissions_Correctly() {

        // given
        when(clientRepository.existsByUsername(anyString())).thenReturn(false);
        when(clientRepository.existsByPhoneNumber(anyString())).thenReturn(false);
        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(validCompany));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(clientRepository.save(any(Client.class))).thenAnswer(invocation -> {
            Client savedClient = invocation.getArgument(0);
            ReflectionTestUtils.setField(savedClient, "id", 1L);
            return savedClient;
        });

        // when
        clientService.saveClient(validRequest);

        // then
        verify(clientRepository).save(argThat(client ->
                client.hasPermission(PermissionType.CUSTOMER_MANAGEMENT) && client.hasPermission(PermissionType.ORDER_MANAGEMENT)
        ));
    }
}
