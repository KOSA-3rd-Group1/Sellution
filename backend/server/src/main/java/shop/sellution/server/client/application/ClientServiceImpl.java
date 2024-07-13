package shop.sellution.server.client.application;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.client.domain.Client;
import shop.sellution.server.client.domain.ClientRepository;
import shop.sellution.server.client.dto.request.*;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.global.type.SmsAuthType;
import shop.sellution.server.sms.application.SmsAuthNumberService;
import shop.sellution.server.sms.dto.request.BaseSmsAuthNumberReq;
import shop.sellution.server.sms.dto.request.SendSmsAuthNumberReq;
import shop.sellution.server.sms.dto.request.VerifySmsAuthNumberReq;

import java.time.Duration;
import java.util.UUID;

import static shop.sellution.server.global.exception.ExceptionCode.*;
import static shop.sellution.server.global.type.SmsAuthType.ID;
import static shop.sellution.server.global.type.SmsAuthType.PASSWORD;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientServiceImpl implements ClientService {

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
        validatePhoneNumber(request.getPhoneNumber());

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_COMPANY_ID));

        Client client = createClient(company, request);
        Client savedClient = clientRepository.save(client);

        return savedClient.getId();
    }

    @Override
    @Transactional(readOnly = true)
    public String findClientId(FindClientIdReq request) {

        // 전화번호로 client 조회
        Client client = clientRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CLIENT));

        // client name 일치 여부 확인
        if (!client.getName().equals(request.getName())) {
            throw new BadRequestException(NOT_FOUND_CLIENT);
        }

        // 인증 번호 일치 여부 확인
        validateAuthNumber(ID.getName(), client, request.getAuthNumber());

        return client.getUsername();
    }

    @Override
    public void findClientIdSmsAuthNumber(FindClientIdSmsAuthNumberReq request) {

        // phoneNumber로 client 조회
        Client client = clientRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CLIENT));

        // 이름 일치 여부 확인
        if (!client.getName().equals(request.getName())) {
            throw new BadRequestException(NOT_FOUND_CLIENT);
        }

        SendSmsAuthNumberReq sendRequest = createSendReq(ID.getName(), client);

        // SMS 인증 번호 발송 요청
        smsAuthNumberService.sendSmsAuthNumber(sendRequest);
    }

    @Override
    public String findClientPassword(FindClientPasswordReq request, HttpServletRequest httpRequest) {

        // username으로 client 조회
        Client client = clientRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CLIENT));

        // 전화번호 일치 여부 확인
        if (!client.getPhoneNumber().equals(request.getPhoneNumber())) {
            throw new BadRequestException(NOT_FOUND_CLIENT);
        }

        // client name 일치 여부 확인
        if (!client.getName().equals(request.getName())) {
            throw new BadRequestException(NOT_FOUND_CLIENT);
        }

        // SMS 인증 번호 검증
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

        // client 아이디로 조회
        Client client = clientRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CLIENT));

        // 전화번호 일치 여부 확인
        if (!client.getPhoneNumber().equals(request.getPhoneNumber())) {
            throw new BadRequestException(NOT_FOUND_CLIENT);
        }

        // client name 일치 여부 확인
        if (!client.getName().equals(request.getName())) {
            throw new BadRequestException(NOT_FOUND_CLIENT);
        }

        // SMS 인증 번호 발송 요청
        SendSmsAuthNumberReq sendRequest = createSendReq(PASSWORD.getName(), client);
        smsAuthNumberService.sendSmsAuthNumber(sendRequest);

    }

    @Override
    public void changeClientPassword(ChangeClientPasswordReq request, HttpServletRequest httpRequest) {

        String ip = getUserIp(httpRequest);
        String redisKey = getRedisKey(request.getToken(), ip);
        String redisValue = redisTemplate.opsForValue().get(redisKey);

        // redis에 저장 여부 검증
        if (redisValue == null) {
            throw new AuthException(INVALID_PASSWORD_RESET_TOKEN);
        }

        String[] parts = redisValue.split(":");
        Long clientId = Long.parseLong(parts[0]);
        int attemptCount = Integer.parseInt(parts[1]);

        // 변경 시도 횟수 검증
        if (attemptCount >= MAX_PASSWORD_CHANGE_ATTEMPTS) {
            redisTemplate.delete(redisKey);
            throw new AuthException(EXPIRED_PASSWORD_RESET_TOKEN);
        }

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new AuthException(ExceptionCode.NOT_FOUND_CLIENT));

        // 기존 비밀 번호와 동일한지 여부
        if (passwordEncoder.matches(request.getNewPassword(), client.getPassword())) {
            incrementAttemptCount(redisKey, clientId, attemptCount);
            throw new AuthException(ExceptionCode.SAME_OLD_PASSWORD);
        }

        client.changePassword(passwordEncoder.encode(request.getNewPassword()));
        clientRepository.save(client);

        redisTemplate.delete(redisKey);
    }

    // username 중복 확인
    private void validateUniqueUsername(String username) {
        if (clientRepository.existsByUsername(username)) {
            throw new BadRequestException(ExceptionCode.DUPLICATED_USERNAME);
        }
    }

    // phoneNumber 중복 확인
    private void validatePhoneNumber(String phoneNumber) {
        if (clientRepository.existsByPhoneNumber(phoneNumber)) {
            throw new BadRequestException(ExceptionCode.DUPLICATED_PHONE_NUMBER);
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

    // SendSmsAuthNumberReq 생성
    private SendSmsAuthNumberReq createSendReq(String authType, Client client) {
        return new SendSmsAuthNumberReq(
                authType,
                client.getUserRole().getRoleName(),
                client.getCompany().getCompanyId(),
                client.getId(),
                client.getPhoneNumber()
        );
    }

    // 인증 번호 유효성 검사
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

    private String getUserIp(HttpServletRequest httpRequest) {
        String xfHeader = httpRequest.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return httpRequest.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    // redisKey 생성
    private String getRedisKey(String token, String ip) {
        return String.format(REDIS_KEY_FORMAT_PASSWORD_RESET, token , ip);
    }

    // 시도 횟수 증가
    private void incrementAttemptCount(String redisKey, Long clientId, int attemptCount) {
        redisTemplate.opsForValue().set(redisKey, clientId + ":" + (attemptCount + 1), Duration.ofMinutes(TOKEN_VALID_MINUTES));
    }
}
