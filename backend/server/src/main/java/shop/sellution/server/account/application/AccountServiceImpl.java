package shop.sellution.server.account.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.account.domain.AccountRepository;
import shop.sellution.server.account.dto.request.SaveAccountReq;
import shop.sellution.server.account.dto.response.FindAccountRes;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.global.exception.BadRequestException;

import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_CUSTOMER_ID;


@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    @Override
    public Page<FindAccountRes> findAllAccountsByCustomerId(Long customerId, Pageable pageable) {
        return accountRepository.findAllByCustomerId(customerId, pageable).map(FindAccountRes::fromEntity);
    }

    @Transactional
    @Override
    public void saveAccount(Long customerId,SaveAccountReq saveAccountReq) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER_ID));

        Account account = Account.builder()
                .customer(customer)
                .accountNumber(saveAccountReq.getAccountNumber())
                .bankCode(saveAccountReq.getBankCode())
                .build();

        accountRepository.save(account);
    }
}
