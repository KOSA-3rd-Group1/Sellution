package shop.sellution.server.client.application;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
public class ClientServiceImpl implements ClientService {

    private final ContractCompanyRepository contractCompanyRepository;
    private final ClientRepository clientRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final SmsAuthNumberService smsAuthNumberService;
    private final RedisTemplate<String, String> redisTemplate;

    private static final String REDIS_KEY_FORMAT_PASSWORD_RESET = "password_reset:%s:%s";
    private static final int TOKEN_VALID_MINUTES = 5;
    private static final int MAX_PASSWORD_CHANGE_ATTEMPTS = 3;

    @Override
    public Long saveClient(SaveClientReq request) {

        validateUniqueUsername(request.getUsername());
        validateUniquePhoneNumber(request.getPhoneNumber());

        Company company = findCompanyById(request.getCompanyId());

        Client client = createClient(company, request);
        Client savedClient = clientRepository.save(client);

        return savedClient.getId();
    }

    @Override
    @Transactional(readOnly = true)
    public void checkClientUsername(CheckClientUsernameReq request) {
        validateUniqueUsername(request.getUsername());
    }

    @Override
    public Boolean checkClientPhoneNumber(CheckClientPhoneNumberReq request) {
        // 전화 번호 중복 검사
        validateUniquePhoneNumber(request.getPhoneNumber());

        String prefixedNumber = "9" + request.getPhoneNumber();
        Long convertedNumber = Long.parseLong(prefixedNumber);

        // 인증 번호 요청
        SendSmsAuthNumberReq sendRequest = new SendSmsAuthNumberReq(
                SIGNUP.getName(),
                "ROLE_CLIENT",
                request.getCompanyId(),
                convertedNumber,
                request.getPhoneNumber()
        );
        smsAuthNumberService.sendSmsAuthNumber(sendRequest);
        return true;
    }

    @Override
    public Boolean verifyClientSmsAuthNumber(FindClientSignupSmsAuthNumberReq request) {
        // 전화 번호 중복 검사
        validateUniquePhoneNumber(request.getPhoneNumber());

        String prefixedNumber = "9" + request.getPhoneNumber();
        Long convertedNumber = Long.parseLong(prefixedNumber);

        VerifySmsAuthNumberReq verifyRequest = new VerifySmsAuthNumberReq(
                SIGNUP.getName(),
                "ROLE_CLIENT",
                request.getCompanyId(),
                convertedNumber,
                request.getAuthNumber()
        );
        smsAuthNumberService.verifySmsAuthNumber(verifyRequest);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public FindCurrentClientInfoRes getCurrentUserInfo() {
        CustomUserDetails customUserDetails = getCustomUserDetailsFromSecurityContext();
        Client client = findClientByUsername(customUserDetails.getUsername());
        ContractCompany contractCompany = contractCompanyRepository.findByCompany_companyId(client.getCompany().getCompanyId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_COMPANY));
        return FindCurrentClientInfoRes.builder()
                .id(client.getId())
                .companyId(client.getCompany().getCompanyId())
                .name(client.getName())
                .userRole(client.getUserRole())
                .contractCompanyName(contractCompany.getContractCompanyName())
                .isAutoApproved(client.getCompany().getIsAutoApproved())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public String findClientId(FindClientIdReq request) {

        Client client = findClientByPhoneNumber(request.getPhoneNumber());

        validateNameMatches(client, request.getName());
        validateAuthNumber(ID.getName(), client, request.getAuthNumber());

        return client.getUsername();
    }

    @Override
    public void findClientIdSmsAuthNumber(FindClientIdSmsAuthNumberReq request) {

        Client client = findClientByPhoneNumber(request.getPhoneNumber());

        validateNameMatches(client, request.getName());

        sendSmsAuthNumber(ID.getName(), client);
    }

    @Override
    public String findClientPassword(FindClientPasswordReq request, HttpServletRequest httpRequest) {

        Client client = findClientByUsername(request.getUsername());

        validatePhoneNumberMatches(client, request.getPhoneNumber());
        validateNameMatches(client, request.getName());
        validateAuthNumber(PASSWORD.getName(), client, request.getAuthNumber());

        // token 생성
        String token = UUID.randomUUID().toString();
        String ip = getUserIp(httpRequest);
        String redisKey = getRedisKey(token, ip);
        String redisValue = client.getId() + ":0";  // clientId:attemptCount
        redisTemplate.opsForValue().set(redisKey, redisValue, Duration.ofMinutes(TOKEN_VALID_MINUTES));

        return token;
    }

    @Override
    public void findClientPasswordSmsAuthNumber(FindClientPasswordSmsAuthNumberReq request) {

        Client client = findClientByUsername(request.getUsername());

        validatePhoneNumberMatches(client, request.getPhoneNumber());
        validateNameMatches(client, request.getName());

        sendSmsAuthNumber(PASSWORD.getName(), client);
    }

    @Override
    public void changeClientPassword(ChangeClientPasswordReq request, HttpServletRequest httpRequest) {

        String redisKey = getRedisKey(request.getToken(), getUserIp(httpRequest));
        String redisValue = redisTemplate.opsForValue().get(redisKey);

        validateRedisValue(redisValue);

        String[] parts = redisValue.split(":");
        Long clientId = Long.parseLong(parts[0]);
        int attemptCount = Integer.parseInt(parts[1]);

        validateAttemptCount(redisKey, attemptCount);

        Client client = findClientById(clientId);
        validateNewPassword(client, request.getNewPassword(), redisKey, clientId, attemptCount);

        client.changePassword(passwordEncoder.encode(request.getNewPassword()));
        clientRepository.save(client);

        redisTemplate.delete(redisKey);
    }

    // company_id로 사업체 조회
    private Company findCompanyById(Long companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_COMPANY_ID));
    }

    // client_id로 고객 조회
    private Client findClientById(Long clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new AuthException(NOT_FOUND_CLIENT));
    }

    // username으로 고객 조회
    private Client findClientByUsername(String username) {
        return clientRepository.findByUsername(username)
                .orElseThrow(() -> new AuthException(NOT_FOUND_CLIENT));
    }

    // phone_number로 고객 조회
    private Client findClientByPhoneNumber(String requestedPhoneNumber) {
        return clientRepository.findByPhoneNumber(requestedPhoneNumber)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CLIENT));
    }

    // username 중복 확인
    private void validateUniqueUsername(String username) {
        if (clientRepository.existsByUsername(username)) {
            throw new BadRequestException(DUPLICATED_USERNAME);
        }
    }

    // phoneNumber 중복 확인
    private void validateUniquePhoneNumber(String phoneNumber) {
        if (clientRepository.existsByPhoneNumber(phoneNumber)) {
            throw new BadRequestException(DUPLICATED_PHONE_NUMBER);
        }
    }

    // SMS 인증 번호 검증
    private void validateAuthNumber(String authType, Client client, String authNumber) {
        VerifySmsAuthNumberReq verifyRequest = new VerifySmsAuthNumberReq(
                authType,
                client.getUserRole().getRoleName(),
                client.getCompany().getCompanyId(),
                client.getId(),
                authNumber
        );
        smsAuthNumberService.verifySmsAuthNumber(verifyRequest);
    }

    // 요청한 전화번호와 고객 정보 일치 여부 검증
    private void validatePhoneNumberMatches(Client client, String requestedPhoneNumber) {
        if (!client.getPhoneNumber().equals(requestedPhoneNumber)) {
            throw new BadRequestException(NOT_FOUND_CLIENT);
        }
    }

    // 요청한 이름과 고객 정보 일치 여부 검증
    private void validateNameMatches(Client client, String requestedName) {
        if (!client.getName().equals(requestedName)) {
            throw new BadRequestException(NOT_FOUND_CLIENT);
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
    private void validateNewPassword(Client client, String newPassword, String redisKey, Long userId, int attemptCount) {
        if (passwordEncoder.matches(newPassword, client.getPassword())) {
            incrementAttemptCount(redisKey, userId, attemptCount);
            throw new AuthException(SAME_OLD_PASSWORD);
        }
    }

    // client 생성
    private Client createClient(Company company, SaveClientReq request) {
        Client client = Client.builder()
                .company(company)
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .build();

        request.getPermissions().forEach((client::addPermission));
        return client;
    }

    // SMS 발송 요청
    private void sendSmsAuthNumber(String authType, Client client) {
        SendSmsAuthNumberReq sendRequest = new SendSmsAuthNumberReq(
                authType,
                client.getUserRole().getRoleName(),
                client.getCompany().getCompanyId(),
                client.getId(),
                client.getPhoneNumber()
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
            throw new AuthException(NOT_FOUND_CLIENT);
        }
    }
}
