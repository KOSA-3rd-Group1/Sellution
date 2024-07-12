package shop.sellution.server.account.application;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.test.util.ReflectionTestUtils;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.account.domain.AccountRepository;
import shop.sellution.server.account.domain.type.BankCode;
import shop.sellution.server.account.dto.request.SaveAccountReq;
import shop.sellution.server.account.dto.request.UpdateAccountReq;
import shop.sellution.server.account.dto.response.FindAccountRes;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.global.exception.BadRequestException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private AccountServiceImpl accountService;

    @DisplayName("계좌 목록을 조회한다")
    @Test
    void findAllAccountsByCustomerId_Success() {
        // given
        Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());
        Customer customer = Customer.builder().build();
        ReflectionTestUtils.setField(customer, "id", 1L);

        List<Account> accounts = List.of(
                Account.builder().accountNumber("427502039102").bankCode(BankCode.KB.getBackCode()).customer(customer).build(),
                Account.builder().accountNumber("3333089607493").bankCode(BankCode.KAKAO.getBackCode()).customer(customer).build()
        );
        Page<Account> accountPage = new PageImpl<>(accounts, pageable, accounts.size());

        when(accountRepository.findAllByCustomerId(1L, pageable)).thenReturn(accountPage);

        // when
        Page<FindAccountRes> result = accountService.findAllAccountsByCustomerId(1L, pageable);

        // then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).getAccountNumber()).isEqualTo("427502039102");
        assertThat(result.getContent().get(1).getAccountNumber()).isEqualTo("3333089607493");
        assertThat(result.getTotalElements()).isEqualTo(2);

        verify(accountRepository).findAllByCustomerId(1L, pageable);
    }

    @DisplayName("계좌를 생성한다.")
    @Test
    void saveAccount_Success() {
        // Given
        Long customerId = 1L;
        SaveAccountReq saveAccountReq = new SaveAccountReq();
        saveAccountReq.setAccountNumber("42750204039102");
        saveAccountReq.setBankCode("004");

        Customer customer = Customer.builder().build();
        ReflectionTestUtils.setField(customer, "id", 1L);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));

        // When
        accountService.saveAccount(customerId, saveAccountReq);

        // Then
        verify(customerRepository).findById(customerId);
        verify(accountRepository).save(any(Account.class));

    }

    @DisplayName("계좌를 수정한다.")
    @Test
    void updateAccount_Success() {
        // Given
        Long accountId = 1L;
        UpdateAccountReq updateAccountReq = new UpdateAccountReq("1234567890", "004");
        Account account = Account.builder().accountNumber("0987654321").bankCode("003").build();
        ReflectionTestUtils.setField(account, "id", accountId);

        when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));

        // When
        accountService.updateAccount(accountId, updateAccountReq);

        // Then
        assertThat(account.getAccountNumber()).isEqualTo("1234567890");
        assertThat(account.getBankCode()).isEqualTo("004");
        verify(accountRepository).findById(accountId);
    }

    @DisplayName("존재하지않는 계좌라면 예외를 발생시킨다.")
    @Test
    void updateAccount_Fail_AccountNotFound() {
        // Given
        Long accountId = 1L;
        UpdateAccountReq updateAccountReq = new UpdateAccountReq("1234567890", "004");

        when(accountRepository.findById(accountId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> accountService.updateAccount(accountId, updateAccountReq))
                .isInstanceOf(BadRequestException.class);
    }

    @DisplayName("계좌를 삭제한다.")
    @Test
    void deleteAccount_Success() {
        // Given
        Long accountId = 1L;
        Account account = Account.builder().accountNumber("0987654321").bankCode("003").build();
        ReflectionTestUtils.setField(account, "id", accountId);

        when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));

        // When
        accountService.deleteAccount(accountId);

        // Then
        verify(accountRepository).findById(accountId);
        verify(accountRepository).delete(account);
    }

    @DisplayName("존재하지않는 계좌라면 예외를 발생시킨다.")
    @Test
    void deleteAccount_Fail_AccountNotFound() {
        // Given
        Long accountId = 1L;

        when(accountRepository.findById(accountId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> accountService.deleteAccount(accountId))
                .isInstanceOf(BadRequestException.class);
    }

}