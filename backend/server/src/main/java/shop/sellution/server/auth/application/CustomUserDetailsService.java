package shop.sellution.server.auth.application;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import shop.sellution.server.auth.dto.CustomUserDetails;
import shop.sellution.server.client.domain.Client;
import shop.sellution.server.client.domain.ClientRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final ClientRepository clientRepository;
    private final CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        String[] parts = username.split(":");

        if (parts.length != 3) {
            throw new AuthException(ExceptionCode.INVALID_USERNAME_FORMAT);
        }

        Long companyId = Optional.of(parts[2])
                .map(Long::parseLong)
                .orElseThrow(() -> new AuthException(ExceptionCode.INVALID_COMPANY_ID_FORMAT));

        String userRole = parts[0];
        String actualUsername = parts[1];
        List<String> roles = new ArrayList<>();

        switch (userRole.toLowerCase()) {
            case "role_client":
                Client client = clientRepository.findByUsername(actualUsername)
                        .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_CLIENT));
                roles.add(client.getUserRole().getAuthority());
                return new CustomUserDetails(client.getId(), client.getCompany().getCompanyId(), client.getUsername() ,client.getPassword(), roles);
            case "role_customer":
                Customer customer = customerRepository.findByCompany_CompanyIdAndUsername(companyId, actualUsername)
                        .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_CUSTOMER));
                roles.add(customer.getUserRole().getAuthority());
                return new CustomUserDetails(customer.getId(), customer.getCompany().getCompanyId(), customer.getUsername(), customer.getPassword(), roles);
            default:
                throw new AuthException(ExceptionCode.INVALID_USER_ROLE);
        }
    }
}
