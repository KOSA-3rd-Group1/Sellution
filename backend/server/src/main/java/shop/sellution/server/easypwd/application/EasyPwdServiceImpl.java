package shop.sellution.server.easypwd.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.easypwd.dto.request.EasyPwdReq;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;

@Service
@RequiredArgsConstructor
public class EasyPwdServiceImpl implements EasyPwdService {

    private final CustomerRepository customerRepository;

    @Override
    @Transactional
    public void registerEasyPwd(Long customerId, EasyPwdReq req) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_CUSTOMER));
        customer.changeEasyPwd(req.getPassword());
    }

    @Override
    public void verifyEasyPwd(Long customerId, EasyPwdReq easyPwdReq) {
        customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_CUSTOMER))
                .verifyEasyPwd(easyPwdReq.getPassword());

    }

    @Override
    public boolean checkEasyPwd(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_CUSTOMER));
        return customer.getEasyPwd() != null && !customer.getEasyPwd().isEmpty();

    }
}
