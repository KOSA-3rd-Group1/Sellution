package shop.sellution.server.customer.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.customer.dto.request.SaveCustomerReq;
import shop.sellution.server.global.exception.BadRequestException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceImplTest {

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private CustomerServiceImpl customerService;

    private SaveCustomerReq validRequest;
    private Company validCompany;

    @BeforeEach
    void setUp() {

        validRequest = new SaveCustomerReq(
                1L,
                "testuser",
                "password123!",
                "Test User",
                "010-1234-5678"
        );

        validCompany = Company.builder()
                .displayName("Test Company")
                .name("Test-Company-1234")
                .build();
        ReflectionTestUtils.setField(validCompany, "companyId", 1L);
    }

    @DisplayName("유효한 요청으로 고객 저장 성공")
    @Test
    void saveCustomer_ValidRequest_Success() {

        // given
        when(customerRepository.existsByCompany_CompanyIdAndUsername(anyLong(), anyString())).thenReturn(false);
        when(customerRepository.existsByCompany_CompanyIdAndPhoneNumber(anyLong(), anyString())).thenReturn(false);
        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(validCompany));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> {
            Customer savedCustomer = invocation.getArgument(0);
            ReflectionTestUtils.setField(savedCustomer, "id", 1L);
            return savedCustomer;
        });

        // when
        Long savedCustomerId = customerService.saveCustomer(validRequest);

        // then
        assertNotNull(savedCustomerId);
        assertEquals(1L, savedCustomerId);
        verify(customerRepository).save(any(Customer.class));
    }

    @DisplayName("중복된 사용자명으로 고객 저장 실패")
    @Test
    void saveCustomer_DuplicateUsername_ThrowsException() {

        // given
        when(customerRepository.existsByCompany_CompanyIdAndUsername(anyLong(), anyString())).thenReturn(true);

        // when & then
        assertThrows(BadRequestException.class,
                () -> customerService.saveCustomer(validRequest));
    }

    @DisplayName("중복된 전화번호로 고객 저장 실패")
    @Test
    void saveCustomer_DuplicatePhoneNumber_ThrowsException() {

        // given
        when(customerRepository.existsByCompany_CompanyIdAndUsername(anyLong(), anyString())).thenReturn(false);
        when(customerRepository.existsByCompany_CompanyIdAndPhoneNumber(anyLong(), anyString())).thenReturn(true);

        // when & then
        assertThrows(BadRequestException.class,
                () -> customerService.saveCustomer(validRequest));
    }

    @DisplayName("존재하지 않는 회사 ID로 고객 저장 실패")
    @Test
    void saveCustomer_NonExistentCompanyId_ThrowsException() {

        // given
        when(customerRepository.existsByCompany_CompanyIdAndUsername(anyLong(), anyString())).thenReturn(false);
        when(customerRepository.existsByCompany_CompanyIdAndPhoneNumber(anyLong(), anyString())).thenReturn(false);
        when(companyRepository.findById(anyLong())).thenReturn(Optional.empty());

        // when & then
        assertThrows(BadRequestException.class,
                () -> customerService.saveCustomer(validRequest));
    }

    @DisplayName("고객 정보 정확히 저장되는지 확인")
    @Test
    void saveCustomer_SetsCustomerInfo_Correctly() {

        // given
        when(customerRepository.existsByCompany_CompanyIdAndUsername(anyLong(), anyString())).thenReturn(false);
        when(customerRepository.existsByCompany_CompanyIdAndPhoneNumber(anyLong(), anyString())).thenReturn(false);
        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(validCompany));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> {
            Customer savedCustomer = invocation.getArgument(0);
            ReflectionTestUtils.setField(savedCustomer, "id", 1L);
            return savedCustomer;
        });

        // when
        customerService.saveCustomer(validRequest);

        // then
        verify(customerRepository).save(argThat(customer ->
                customer.getUsername().equals("testuser") &&
                        customer.getName().equals("Test User") &&
                        customer.getPhoneNumber().equals("010-1234-5678") &&
                        customer.getCompany().getCompanyId().equals(1L)
        ));
    }
}
