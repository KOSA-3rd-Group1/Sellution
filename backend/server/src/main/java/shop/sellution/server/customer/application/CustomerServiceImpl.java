package shop.sellution.server.customer.application;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.auth.dto.CustomUserDetails;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.customer.dto.CustomerSearchCondition;
import shop.sellution.server.customer.dto.request.*;
import shop.sellution.server.customer.dto.resonse.FindCustomerInfoRes;
import shop.sellution.server.customer.dto.resonse.FindCustomerRes;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.sms.application.SmsAuthNumberService;
import shop.sellution.server.sms.dto.request.SendSmsAuthNumberReq;
import shop.sellution.server.sms.dto.request.VerifySmsAuthNumberReq;

import java.time.Duration;
import java.util.UUID;

import static shop.sellution.server.global.exception.ExceptionCode.*;
import static shop.sellution.server.global.type.SmsAuthType.*;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerServiceImpl implements CustomerService{

    private final CompanyRepository companyRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final SmsAuthNumberService smsAuthNumberService;
    private final RedisTemplate<String, String> redisTemplate;

    private static final String REDIS_KEY_FORMAT_PASSWORD_RESET = "password_reset:%s:%s";
    private static final int TOKEN_VALID_MINUTES = 5;
    private static final int MAX_PASSWORD_CHANGE_ATTEMPTS = 3;

    @Override
    public Long saveCustomer(SaveCustomerReq request) {

        validateUniqueUsername(request.getCompanyId(), request.getUsername());
        validateUniquePhoneNumber(request.getCompanyId(), request.getPhoneNumber());

        Company company = findCompanyById(request.getCompanyId());

        Customer customer = createCustomer(company, request);
        Customer savedCustomer = customerRepository.save(customer);

        return savedCustomer.getId();
    }

    @Override
    @Transactional(readOnly = true)
    public void checkCustomerUsername(CheckCustomerUsernameReq request) {
        validateUniqueUsername(request.getCompanyId(), request.getUsername());
    }

    @Override
    @Transactional(readOnly = true)
    public String findCustomerId(FindCustomerIdReq request) {

        Customer customer = findCustomerByCompanyIdAndPhoneNumber(request.getCompanyId(), request.getPhoneNumber());

        validateNameMatches(customer, request.getName());
        validateAuthNumber(ID.getName(), customer, request.getAuthNumber());

        return customer.getUsername();
    }

    @Override
    public void findCustomerIdSmsAuthNumber(FindCustomerIdSmsAuthNumberReq request) {

        Customer customer = findCustomerByCompanyIdAndPhoneNumber(request.getCompanyId(), request.getPhoneNumber());

        validateNameMatches(customer, request.getName());

        sendSmsAuthNumber(ID.getName(), customer);
    }

    @Override
    public String findCustomerPassword(FindCustomerPasswordReq request, HttpServletRequest httpRequest) {

        Customer customer = findCustomerByCompanyIdAndUsername(request.getCompanyId(), request.getUsername());

        validatePhoneNumberMatches(customer, request.getPhoneNumber());
        validateNameMatches(customer, request.getName());
        validateAuthNumber(PASSWORD.getName(), customer, request.getAuthNumber());

        // token 생성
        String token = UUID.randomUUID().toString();
        String ip = getUserIp(httpRequest);
        String redisKey = getRedisKey(token, ip);
        String redisValue = customer.getId() + ":0";  // customerId:attemptCount
        redisTemplate.opsForValue().set(redisKey, redisValue, Duration.ofMinutes(TOKEN_VALID_MINUTES));

        return token;
    }

    @Override
    public void findCustomerPasswordSmsAuthNumber(FindCustomerPasswordSmsAuthNumberReq request) {

        Customer customer = findCustomerByCompanyIdAndUsername(request.getCompanyId(), request.getUsername());

        validatePhoneNumberMatches(customer, request.getPhoneNumber());
        validateNameMatches(customer, request.getName());

        sendSmsAuthNumber(PASSWORD.getName(), customer);
    }

    @Override
    public void changeCustomerPassword(ChangeCustomerPasswordReq request, HttpServletRequest httpRequest) {

        String redisKey = getRedisKey(request.getToken(), getUserIp(httpRequest));
        String redisValue = redisTemplate.opsForValue().get(redisKey);

        validateRedisValue(redisValue);

        String[] parts = redisValue.split(":");
        Long customerId = Long.parseLong(parts[0]);
        int attemptCount = Integer.parseInt(parts[1]);

        validateAttemptCount(redisKey, attemptCount);

        Customer customer = findCustomerById(customerId);
        validateNewPassword(customer, request.getNewPassword(), redisKey, customerId, attemptCount);

        customer.changePassword(passwordEncoder.encode(request.getNewPassword()));
        customerRepository.save(customer);

        redisTemplate.delete(redisKey);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FindCustomerRes> findAllCustomerByCompanyId(CustomerSearchCondition condition, Pageable pageable) {
        CustomUserDetails userDetails = getCustomUserDetailsFromSecurityContext();
        Long companyId = userDetails.getCompanyId();
        Page<Customer> customers = customerRepository.findCustomerByCompanyIdAndCondition(companyId, condition, pageable);
        return customers.map(customer -> FindCustomerRes.fromEntity(customer));
    }

    // company_id로 사업체 조회
    private Company findCompanyById(Long companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_COMPANY_ID));
    }

    // customer_id로 회원 조회
    private Customer findCustomerById(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new AuthException(NOT_FOUND_CUSTOMER));
    }

    // companyId, username으로 회원 조회
    private Customer findCustomerByCompanyIdAndUsername(Long companyId, String username) {
        return customerRepository.findByCompany_CompanyIdAndUsername(companyId, username)
                .orElseThrow(() -> new AuthException(NOT_FOUND_CUSTOMER));
    }

    // comapnyId, phone_number로 회원 조회
    private Customer findCustomerByCompanyIdAndPhoneNumber(Long companyId, String requestedPhoneNumber) {
        return customerRepository.findByCompany_CompanyIdAndPhoneNumber(companyId, requestedPhoneNumber)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));
    }

    // company 별 username 중복 확인 (다른 company에서는 username 중복 가능)
    private void validateUniqueUsername(Long companyId, String username) {
        if (customerRepository.existsByCompany_CompanyIdAndUsername(companyId, username)) {
            throw new BadRequestException(DUPLICATED_USERNAME);
        }
    }

    // company 별 phoneNumber 중복 확인 (다른 company에서는 phoneNumber는 중복 가능)
    private void validateUniquePhoneNumber(Long companyId, String phoneNumber) {
        if (customerRepository.existsByCompany_CompanyIdAndPhoneNumber(companyId, phoneNumber)) {
            throw new BadRequestException(DUPLICATED_PHONE_NUMBER);
        }
    }

    // SMS 인증 번호 검증
    private void validateAuthNumber(String authType, Customer customer, String authNumber) {
        VerifySmsAuthNumberReq verifyRequest = new VerifySmsAuthNumberReq(
                authType,
                customer.getUserRole().getRoleName(),
                customer.getCompany().getCompanyId(),
                customer.getId(),
                authNumber
        );
        smsAuthNumberService.verifySmsAuthNumber(verifyRequest);
    }

    // 요청한 전화번호와 회원 정보 일치 여부 검증
    private void validatePhoneNumberMatches(Customer customer, String requestedPhoneNumber) {
        if (!customer.getPhoneNumber().equals(requestedPhoneNumber)) {
            throw new BadRequestException(NOT_FOUND_CUSTOMER);
        }
    }

    // 요청한 이름과 회원 정보 일치 여부 검증
    private void validateNameMatches(Customer customer, String requestedName) {
        if (!customer.getName().equals(requestedName)) {
            throw new BadRequestException(NOT_FOUND_CUSTOMER);
        }
    }

    // redis value 유효성 검사
    private void validateRedisValue(String redisValue) {
        if (redisValue == null) {
            throw new AuthException(INVALID_PASSWORD_RESET_TOKEN);
        }
    }

    // 비밀번호 변경 시도 횟수 유효성 검사
    private void validateAttemptCount(String redisKey, int attemptCount) {
        if (attemptCount >= MAX_PASSWORD_CHANGE_ATTEMPTS) {
            redisTemplate.delete(redisKey);
            throw new AuthException(EXPIRED_PASSWORD_RESET_TOKEN);
        }
    }

    // 기존 비밀 번호와 동일한지 여부
    private void validateNewPassword(Customer customer, String newPassword, String redisKey, Long userId, int attemptCount) {
        if (passwordEncoder.matches(newPassword, customer.getPassword())) {
            incrementAttemptCount(redisKey, userId, attemptCount);
            throw new AuthException(SAME_OLD_PASSWORD);
        }
    }

    // customer 생성
    private Customer createCustomer(Company company, SaveCustomerReq request) {
        return Customer.builder()
                .company(company)
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .build();
    }

    // SMS 발송 요청
    private void sendSmsAuthNumber(String authType, Customer customer) {
        SendSmsAuthNumberReq sendRequest = new SendSmsAuthNumberReq(
                authType,
                customer.getUserRole().getRoleName(),
                customer.getCompany().getCompanyId(),
                customer.getId(),
                customer.getPhoneNumber()
        );
        smsAuthNumberService.sendSmsAuthNumber(sendRequest);
    }

    // redisKey 생성
    private String getRedisKey(String token, String ip) {
        return String.format(REDIS_KEY_FORMAT_PASSWORD_RESET, token , ip);
    }

    // 사용자 ip
    private String getUserIp(HttpServletRequest httpRequest) {
        String xfHeader = httpRequest.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return httpRequest.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    // 비밀번호 시도 횟수 증가
    private void incrementAttemptCount(String redisKey, Long userId, int attemptCount) {
        redisTemplate.opsForValue().set(redisKey, userId + ":" + (attemptCount + 1), Duration.ofMinutes(TOKEN_VALID_MINUTES));
    }

    // securitycontextholder에서 정보 가져오기
    private CustomUserDetails getCustomUserDetailsFromSecurityContext() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof CustomUserDetails) {
            return (CustomUserDetails) principal;
        } else {
            throw new AuthException(NOT_FOUND_USER);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public FindCustomerInfoRes getCustomerInfo(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_CUSTOMER));
        return FindCustomerInfoRes.builder()
                .name(customer.getName())
                .customerType(customer.getType())
                .build();
    }

    //본인 인증을 위한 메서드
    public void sendAuthenticationCode(Long customerId, String name, String phoneNumber) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));

        if (!customer.getName().equals(name) || !customer.getPhoneNumber().equals(phoneNumber)) {
            throw new BadRequestException(INVALID_CUSTOMER_INFO);
        }

        sendSmsAuthNumber(AUTHENTICATION.getName(), customer);
    }

    //인증번호 검증을 위한 메소드
    public void verifyAuthenticationCode(Long customerId, String authCode) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));

        VerifySmsAuthNumberReq verifyRequest = new VerifySmsAuthNumberReq(
                AUTHENTICATION.getName(),
                customer.getUserRole().getRoleName(),
                customer.getCompany().getCompanyId(),
                customer.getId(),
                authCode
        );

        smsAuthNumberService.verifySmsAuthNumber(verifyRequest);
    }


}
