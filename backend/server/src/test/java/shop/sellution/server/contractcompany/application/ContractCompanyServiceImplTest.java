package shop.sellution.server.contractcompany.application;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyRepository;
import shop.sellution.server.contractcompany.domain.ContractCompany;
import shop.sellution.server.contractcompany.domain.ContractCompanyRepository;
import shop.sellution.server.contractcompany.dto.request.SaveContractCompanyReq;
import shop.sellution.server.global.exception.BadRequestException;

import jakarta.validation.ConstraintViolation;
import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContractCompanyServiceImplTest {

    @Mock
    private ContractCompanyRepository contractCompanyRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private ContractCompanyServiceImpl contractCompanyService;

    private Validator validator;

    private SaveContractCompanyReq validRequest;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        validRequest = SaveContractCompanyReq.builder()
                .contractCompanyName("Test Company")
                .businessRegistrationNumber("123-45-67890")
                .contractAuthId("testuser123")
                .contractAuthPassword("ValidPass1!")
                .build();
    }

    @DisplayName("계약 사업체를 생성한다")
    @Test
    void saveContractCompany_ValidInput_Success() {

        // given
        Company savedCompany = Company.builder()
                .displayName("Test Company")
                .name("Test-Company-1234")
                .build();
        savedCompany.setCompanyId(1L);

        ContractCompany savedContractCompany = ContractCompany.builder()
                .companyId(1L)
                .contractCompanyName("Test Company")
                .businessRegistrationNumber("123-45-67890")
                .contractAuthId("testuser123")
                .contractAuthPassword("encodedPassword")
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();

        when(contractCompanyRepository.existsByBusinessRegistrationNumber(any())).thenReturn(false);
        when(contractCompanyRepository.existsByContractAuthId(any())).thenReturn(false);
        when(companyRepository.save(any())).thenReturn(savedCompany);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(contractCompanyRepository.save(any())).thenReturn(savedContractCompany);

        // when
        assertDoesNotThrow(() -> contractCompanyService.saveContractCompany(validRequest));

        // then
        verify(contractCompanyRepository).existsByBusinessRegistrationNumber("123-45-67890");
        verify(contractCompanyRepository).existsByContractAuthId("testuser123");
        verify(companyRepository).save(any(Company.class));
        verify(passwordEncoder).encode("ValidPass1!");
        verify(contractCompanyRepository).save(any(ContractCompany.class));
    }

    @DisplayName("사업체 등록 번호가 중복이라면 예외를 발생시킨다.")
    @Test
    void saveContractCompany_DuplicateBusinessRegistrationNumber_ThrowsException() {

        // given
        when(contractCompanyRepository.existsByBusinessRegistrationNumber(any())).thenReturn(true);

        // when & & then
        assertThrows(BadRequestException.class, () -> contractCompanyService.saveContractCompany(validRequest));
    }

    @DisplayName("사업체 인증 계정 아이디가 중복이라면 예외를 발생시킨다.")
    @Test
    void saveContractCompany_DuplicateContractAuthId_ThrowsException() {

        // given
        when(contractCompanyRepository.existsByBusinessRegistrationNumber(any())).thenReturn(false);
        when(contractCompanyRepository.existsByContractAuthId(any())).thenReturn(true);

        // when & then
        assertThrows(BadRequestException.class, () -> contractCompanyService.saveContractCompany(validRequest));
    }

    @DisplayName("사업체 등록 번호가 유효하지 않다면 예외를 발생시킨다.")
    @Test
    void saveContractCompany_InvalidBusinessRegistrationNumber_ValidationFails() {

        // given
        SaveContractCompanyReq invalidRequest = SaveContractCompanyReq.builder()
                .contractCompanyName("Test Company")
                .businessRegistrationNumber("invalid-number")
                .contractAuthId("testuser123")
                .contractAuthPassword("ValidPass1!")
                .build();

        // when
        Set<ConstraintViolation<SaveContractCompanyReq>> violations = validator.validate(invalidRequest);

        // then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("businessRegistrationNumber")));
    }

    @DisplayName("사업체 인증 계정 아이디가 유효하지 않다면 예외를 발생시킨다.")
    @Test
    void saveContractCompany_InvalidContractAuthId_ValidationFails() {

        // given
        SaveContractCompanyReq invalidRequest = SaveContractCompanyReq.builder()
                .contractCompanyName("Test Company")
                .businessRegistrationNumber("123-45-67890")
                .contractAuthId("inv@lid")
                .contractAuthPassword("ValidPass1!")
                .build();

        // when
        Set<ConstraintViolation<SaveContractCompanyReq>> violations = validator.validate(invalidRequest);

        // then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("contractAuthId")));
    }

    @DisplayName("사업체 인증 계정 비밀번호가 유효하지 않다면 예외를 발생시킨다.")
    @Test
    void saveContractCompany_InvalidContractAuthPassword_ValidationFails() {

        // given
        SaveContractCompanyReq invalidRequest = SaveContractCompanyReq.builder()
                .contractCompanyName("Test Company")
                .businessRegistrationNumber("123-45-67890")
                .contractAuthId("testuser123")
                .contractAuthPassword("short")
                .build();

        // when
        Set<ConstraintViolation<SaveContractCompanyReq>> violations = validator.validate(invalidRequest);

        // then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("contractAuthPassword")));
    }
}
