package shop.sellution.server.account.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.account.domain.AccountRepository;
import shop.sellution.server.account.dto.request.CheckAccountReq;
import shop.sellution.server.account.dto.request.SaveAccountReq;
import shop.sellution.server.account.dto.request.UpdateAccountReq;
import shop.sellution.server.account.dto.response.FindAccountRes;
import shop.sellution.server.account.infrastructure.AccountAuthService;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.util.JasyptEncryptionUtil;

import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_ACCOUNT;
import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_CUSTOMER;


@Transactional
@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final AccountAuthService accountAuthService;
    private final JasyptEncryptionUtil jasyptEncryptionUtil;

    @Transactional(readOnly = true)
    @Override
    public Page<FindAccountRes> findAllAccountsByCustomerId(Long customerId, Pageable pageable) {
        return accountRepository.findAllByCustomerId(customerId, pageable).map(FindAccountRes::fromEntity);
    }

    @Override
    public void saveAccount(Long customerId,SaveAccountReq saveAccountReq) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));

        accountAuthService.checkAccount(CheckAccountReq.fromDto(saveAccountReq));

        String accountNumber = saveAccountReq.getAccountNumber();
        StringBuilder sb = new StringBuilder();
        String encrypt = jasyptEncryptionUtil.encrypt(accountNumber.substring(0, accountNumber.length() - 3));// 뒤 4자리 제외 암호화
        sb.append(encrypt);
        sb.append(accountNumber.substring(accountNumber.length()-4));

        Account account = Account.builder()
                .customer(customer)
                .accountNumber(sb.toString())
                .bankCode(saveAccountReq.getBankCode())
                .build();

        accountRepository.save(account);
    }

    @Override
    public void updateAccount(Long accountId, UpdateAccountReq updateAccountReq) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ACCOUNT));

        accountAuthService.checkAccount(CheckAccountReq.fromDto(updateAccountReq));

        account.update(updateAccountReq.getAccountNumber(), updateAccountReq.getBankCode());

    }

    @Override
    public void deleteAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ACCOUNT));

        accountRepository.delete(account);
    }

}
