package shop.sellution.server.account.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.account.domain.AccountRepository;
import shop.sellution.server.account.dto.request.CheckAccountReq;
import shop.sellution.server.account.dto.request.SaveAccountReq;
import shop.sellution.server.account.dto.request.UpdateAccountReq;
import shop.sellution.server.account.dto.response.FindAccountDetailRes;
import shop.sellution.server.account.dto.response.FindAccountRes;
import shop.sellution.server.account.infrastructure.AccountAuthService;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.global.util.JasyptEncryptionUtil;

import java.security.MessageDigest;
import java.util.Base64;
import java.util.Optional;

import static shop.sellution.server.global.exception.ExceptionCode.*;


@Transactional
@RequiredArgsConstructor
@Service
@Slf4j
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final AccountAuthService accountAuthService;
    private final JasyptEncryptionUtil jasyptEncryptionUtil;

    @Transactional(readOnly = true)
    @Override
    public Page<FindAccountRes> findAllAccountsByCustomerId(Long customerId, Pageable pageable) {
        return accountRepository.findAllByCustomerId(customerId, pageable)
                .map(FindAccountRes::fromEntity)
                .map((FindAccountRes findAccountRes) -> {
                    findAccountRes.setAccountNumber(maskAccountNumber(findAccountRes.getAccountNumber()));
                    return findAccountRes;
                });
    }

    @Override
    public Long saveAccount(Long customerId,SaveAccountReq saveAccountReq) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));

        String accountNumber = saveAccountReq.getAccountNumber();
        String accountHash = generateAccountHash(accountNumber);

        Optional<Account> findAccount = accountRepository.findAccountByAccountHash(customerId, accountHash);

        accountAuthService.checkAccount(CheckAccountReq.fromDto(saveAccountReq));

        // 이미 등록된 계좌가 있으면
        if (findAccount.isPresent() && findAccount.get().getIsDeleted() == DisplayStatus.N) {
            throw new BadRequestException(ALREADY_ACCOUNT);
        }

        // 삭제되었던 계좌라면 다시 활성화
        if (findAccount.isPresent() && findAccount.get().getIsDeleted() == DisplayStatus.Y) {
            findAccount.get().restore();
            return findAccount.get().getId();
        }



        StringBuilder sb = new StringBuilder();
        String encrypt = jasyptEncryptionUtil.encrypt(accountNumber.substring(0, accountNumber.length() - 4));// 뒤 4자리 제외 암호화
        sb.append(encrypt);
        sb.append(accountNumber.substring(accountNumber.length()-4));
        Account account = Account.builder()
                .customer(customer)
                .accountNumber(sb.toString())
                .accountHash(accountHash)
                .bankCode(saveAccountReq.getBankCode())
                .build();

        accountRepository.save(account);
        return account.getId();
    }

    @Override
    public void updateAccount(Long accountId, UpdateAccountReq updateAccountReq) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ACCOUNT));


        String newAccountNumber = updateAccountReq.getAccountNumber();
        String newAccountHash = generateAccountHash(newAccountNumber);

        Optional<Account> findAccount = accountRepository.findAccountByAccountHash(account.getCustomer().getId(), newAccountHash);

        if (findAccount.isPresent() && findAccount.get().getIsDeleted() == DisplayStatus.Y) {
            throw new BadRequestException(NOT_FOUND_ACCOUNT);
        }

        accountAuthService.checkAccount(CheckAccountReq.fromDto(updateAccountReq));


        StringBuilder sb = new StringBuilder();
        String encrypt = jasyptEncryptionUtil.encrypt(newAccountNumber.substring(0, newAccountNumber.length() - 4));
        sb.append(encrypt);
        sb.append(newAccountNumber.substring(newAccountNumber.length()-4));

        account.update(sb.toString(), newAccountHash, updateAccountReq.getBankCode());
    }

    @Override
    public void deleteAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ACCOUNT));

        Optional<Account> findAccount = accountRepository.findAccountByAccountHash(account.getCustomer().getId(), account.getAccountHash());

        if (findAccount.isPresent() && findAccount.get().getIsDeleted() == DisplayStatus.Y) {
            throw new BadRequestException(NOT_FOUND_ACCOUNT);
        }

        account.delete();
    }

    public String maskAccountNumber(String accountNumber) {
        String decryptedAccountNumber = jasyptEncryptionUtil.decrypt(accountNumber.substring(0, accountNumber.length() - 4));
        return "*".repeat(decryptedAccountNumber.length()) + accountNumber.substring(accountNumber.length()-4);
    }

    public String getDecryptedAccountNumber(String accountNumber) {
        return jasyptEncryptionUtil.decrypt(accountNumber.substring(0, accountNumber.length() - 4)) + accountNumber.substring(accountNumber.length()-4);
    }

    @Override
    public FindAccountDetailRes findAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ACCOUNT));
        FindAccountDetailRes result = FindAccountDetailRes.fromEntity(account);
        result.setAccountNumber(maskAccountNumber(result.getAccountNumber()));
        return result;
    }

    private String generateAccountHash(String accountNumber) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(accountNumber.getBytes());
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (Exception e) {
            throw new RuntimeException("계좌번호 해시 생성 실패", e);
        }
    }
}
