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
import org.springframework.test.util.ReflectionTestUtils;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyRepository;
import shop.sellution.server.contractcompany.domain.ContractCompany;
import shop.sellution.server.contractcompany.domain.ContractCompanyRepository;
import shop.sellution.server.contractcompany.dto.request.FindContractCompanyReq;
import shop.sellution.server.contractcompany.dto.request.SaveContractCompanyReq;
import shop.sellution.server.contractcompany.dto.response.FindContractCompanyRes;
import shop.sellution.server.global.exception.BadRequestException;

import jakarta.validation.ConstraintViolation;
import shop.sellution.server.global.exception.ExceptionCode;

import java.time.LocalDateTime;
import java.util.Optional;
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
    private SaveContractCompanyReq saveValidRequest;
    private FindContractCompanyReq findValidRequest;
    private ContractCompany validContractCompany;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        saveValidRequest = SaveContractCompanyReq.builder()
                .contractCompanyName("Test Company")
                .businessRegistrationNumber("123-45-67890")
                .contractAuthId("testuser123")
                .contractAuthPassword("ValidPass1!")
                .build();

        findValidRequest = new FindContractCompanyReq();
        ReflectionTestUtils.setField(findValidRequest, "contractAuthId", "testuser123");
        ReflectionTestUtils.setField(findValidRequest, "contractAuthPassword", "ValidPass1!");

        validContractCompany = ContractCompany.builder()
                .companyId(1L)
                .contractCompanyName("Test Company")
                .businessRegistrationNumber("123-45-67890")
                .contractAuthId("testuser123")
                .contractAuthPassword("encodedPassword")
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
        assertDoesNotThrow(() -> contractCompanyService.saveContractCompany(saveValidRequest));

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
        assertThrows(BadRequestException.class, () -> contractCompanyService.saveContractCompany(saveValidRequest));
    }

    @DisplayName("사업체 인증 계정 아이디가 중복이라면 예외를 발생시킨다.")
    @Test
    void saveContractCompany_DuplicateContractAuthId_ThrowsException() {

        // given
        when(contractCompanyRepository.existsByBusinessRegistrationNumber(any())).thenReturn(false);
        when(contractCompanyRepository.existsByContractAuthId(any())).thenReturn(true);

        // when & then
        assertThrows(BadRequestException.class, () -> contractCompanyService.saveContractCompany(saveValidRequest));
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

    @DisplayName("유효한 계약 사업체 인증 정보로 조회에 성공한다")
    @Test
    void findContractCompany_ValidInput_Success() {

        // given
        when(contractCompanyRepository.findByContractAuthId(anyString())).thenReturn(Optional.of(validContractCompany));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        // when
        FindContractCompanyRes result = contractCompanyService.findContractCompany(findValidRequest);

        // then
        assertNotNull(result);
        assertEquals(validContractCompany.getCompanyId(), result.getCompanyId());
        assertEquals(validContractCompany.getContractCompanyName(), result.getContractCompanyName());
        assertEquals(validContractCompany.getBusinessRegistrationNumber(), result.getBusinessRegistrationNumber());
    }

    @DisplayName("존재하지 않는 계약 사업체 인증 ID로 조회 시 예외를 발생시킨다")
    @Test
    void findContractCompany_NonExistentAuthId_ThrowsException() {

        // given
        when(contractCompanyRepository.findByContractAuthId(anyString())).thenReturn(Optional.empty());

        // when & then
        assertThrows(BadRequestException.class, () -> contractCompanyService.findContractCompany(findValidRequest));
    }

    @DisplayName("잘못된 비밀번호로 조회 시 예외를 발생시킨다")
    @Test
    void findContractCompany_InvalidPassword_ThrowsException() {

        // given
        when(contractCompanyRepository.findByContractAuthId(anyString())).thenReturn(Optional.of(validContractCompany));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // when & then
        assertThrows(BadRequestException.class, () -> contractCompanyService.findContractCompany(findValidRequest));
    }

    @DisplayName("유효하지 않은 계약 사업체 인증 ID 형식으로 조회 시 유효성 검사에 실패한다")
    @Test
    void findContractCompany_InvalidAuthIdFormat_ValidationFails() {

        // given
        FindContractCompanyReq invalidRequest = new FindContractCompanyReq();
        ReflectionTestUtils.setField(invalidRequest, "contractAuthId", "inv@lid");
        ReflectionTestUtils.setField(invalidRequest, "contractAuthPassword", "ValidPass1!");

        // when
        Set<ConstraintViolation<FindContractCompanyReq>> violations = validator.validate(invalidRequest);

        // then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("contractAuthId")));
    }

    @DisplayName("유효하지 않은 비밀번호 형식으로 조회 시 유효성 검사에 실패한다")
    @Test
    void findContractCompany_InvalidPasswordFormat_ValidationFails() {

        // given
        FindContractCompanyReq invalidRequest = new FindContractCompanyReq();
        ReflectionTestUtils.setField(invalidRequest, "contractAuthId", "testuser123");
        ReflectionTestUtils.setField(invalidRequest, "contractAuthPassword", "short");

        // when
        Set<ConstraintViolation<FindContractCompanyReq>> violations = validator.validate(invalidRequest);

        // then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("contractAuthPassword")));
    }
}
