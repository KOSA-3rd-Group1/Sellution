package shop.sellution.server.client.application;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.client.domain.Client;
import shop.sellution.server.client.domain.ClientRepository;
import shop.sellution.server.client.dto.request.SaveClientReq;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Long saveClient(SaveClientReq request) {

        validateUniqueUsername(request.getUsername());
        validatePhoneNumber(request.getPhoneNumber());

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY_ID));

        Client client = createClient(company, request);
        Client savedClient = clientRepository.save(client);

        return savedClient.getId();
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
}
