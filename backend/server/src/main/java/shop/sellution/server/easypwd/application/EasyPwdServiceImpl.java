package shop.sellution.server.easypwd.application;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.easypwd.dto.request.EasyPwdReq;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;

import static shop.sellution.server.global.exception.ExceptionCode.INVALID_EASY_PWD;
import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_CUSTOMER;

@Service
@RequiredArgsConstructor
public class EasyPwdServiceImpl implements EasyPwdService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void registerEasyPwd(Long customerId, EasyPwdReq req) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));
        String encodedEasyPwd = passwordEncoder.encode(req.getPassword());
        customer.changeEasyPwd(encodedEasyPwd);
    }

    @Override
    public void verifyEasyPwd(Long customerId, EasyPwdReq easyPwdReq) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));
        String easyPwd = customer.getEasyPwd();
        if (!passwordEncoder.matches(easyPwdReq.getPassword(), easyPwd)) {
            throw new BadRequestException(INVALID_EASY_PWD);
        }
    }

    @Override
    public boolean checkEasyPwd(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));
        return customer.getEasyPwd() != null && !customer.getEasyPwd().isEmpty();

    }
}
