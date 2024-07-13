package shop.sellution.server.client.application;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.client.domain.Client;
import shop.sellution.server.client.domain.ClientRepository;
import shop.sellution.server.client.dto.request.FindClientIdReq;
import shop.sellution.server.client.dto.request.SaveClientReq;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.sms.application.SmsAuthNumberService;
import shop.sellution.server.sms.dto.request.VerifySmsAuthNumberReq;

import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_CLIENT;
import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_COMPANY_ID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final SmsAuthNumberService smsAuthNumberService;

    @Override
    @Transactional
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
    public String findClientId(FindClientIdReq request) {

        // 전화번호로 client 조회
        Client client = clientRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CLIENT));

        // client name 일치 여부 확인
        if (!client.getName().equals(request.getName())) {
            throw new BadRequestException(NOT_FOUND_CLIENT);
        }

        // 인증 번호 일치 여부 확인
        validateAuthNumber(client, request.getAuthNumber());

        return client.getUsername();
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

    // 인증 번호 유효성 검사
    private void validateAuthNumber(Client client, String authNumber) {
        VerifySmsAuthNumberReq verifyRequest = new VerifySmsAuthNumberReq(
                client.getUserRole().getRoleName(),
                client.getCompany().getCompanyId(),
                client.getId(),
                authNumber
        );
        smsAuthNumberService.verifySmsAuthNumber(verifyRequest);
    }
}
