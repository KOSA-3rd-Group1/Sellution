package shop.sellution.server.easypwd.application;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.easypwd.dto.request.EasyPwdReq;
import shop.sellution.server.global.exception.BadRequestException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EasyPwdServiceImplTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EasyPwdServiceImpl easyPwdService;

    @Test
    @DisplayName("간편 비밀번호 등록 성공")
    void registerEasyPwd_Success() {
        // Given
        Long customerId = 1L;
        EasyPwdReq req = new EasyPwdReq();
        req.setPassword("123456");
        Customer customer = mock(Customer.class);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(passwordEncoder.encode(req.getPassword())).thenReturn("encodedPassword");

        // When
        easyPwdService.registerEasyPwd(customerId, req);

        // Then
        verify(customer).changeEasyPwd("encodedPassword");
    }

    @Test
    @DisplayName("간편 비밀번호 등록 실패 - 고객 존재하지않음")
    void registerEasyPwd_Failure_CustomerNotFound() {
        // Given
        Long customerId = 1L;
        EasyPwdReq req = new EasyPwdReq();
        req.setPassword("123456");

        when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(BadRequestException.class, () -> easyPwdService.registerEasyPwd(customerId, req));
    }

    @Test
    @DisplayName("간편 비밀번호 검증 성공")
    void verifyEasyPwd_Success() {
        // Given
        Long customerId = 1L;
        EasyPwdReq req = new EasyPwdReq();
        req.setPassword("123456");
        Customer customer = mock(Customer.class);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(customer.getEasyPwd()).thenReturn("encodedPassword");
        when(passwordEncoder.matches(req.getPassword(), "encodedPassword")).thenReturn(true);

        // When & Then
        assertDoesNotThrow(() -> easyPwdService.verifyEasyPwd(customerId, req));
    }

    @Test
    @DisplayName("간편 비밀번호 검증 실패 - 잘못된 비밀번호")
    void verifyEasyPwd_Failure_InvalidPassword() {
        // Given
        Long customerId = 1L;
        EasyPwdReq req = new EasyPwdReq();
        req.setPassword("123456");
        Customer customer = mock(Customer.class);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(customer.getEasyPwd()).thenReturn("encodedPassword");
        when(passwordEncoder.matches(req.getPassword(), "encodedPassword")).thenReturn(false);

        // When & Then
        assertThrows(BadRequestException.class, () -> easyPwdService.verifyEasyPwd(customerId, req));
    }

    @Test
    @DisplayName("간편 비밀번호 확인 - 존재함")
    void checkEasyPwd_Exists() {
        // Given
        Long customerId = 1L;
        Customer customer = mock(Customer.class);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(customer.getEasyPwd()).thenReturn("encodedPassword");

        // When
        boolean result = easyPwdService.checkEasyPwd(customerId);

        // Then
        assertTrue(result);
    }

    @Test
    @DisplayName("간편 비밀번호 확인 - 존재하지 않음")
    void checkEasyPwd_NotExists() {
        // Given
        Long customerId = 1L;
        Customer customer = mock(Customer.class);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(customer.getEasyPwd()).thenReturn(null);

        // When
        boolean result = easyPwdService.checkEasyPwd(customerId);

        // Then
        assertFalse(result);
    }
}