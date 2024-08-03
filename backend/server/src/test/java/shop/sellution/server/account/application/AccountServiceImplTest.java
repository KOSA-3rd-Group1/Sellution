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
import shop.sellution.server.account.dto.request.CheckAccountReq;
import shop.sellution.server.account.dto.request.SaveAccountReq;
import shop.sellution.server.account.dto.request.UpdateAccountReq;
import shop.sellution.server.account.dto.response.CheckAccountRes;
import shop.sellution.server.account.dto.response.FindAccountRes;
import shop.sellution.server.account.infrastructure.AccountAuthService;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.global.util.JasyptEncryptionUtil;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private AccountAuthService accountAuthService;

    @Mock
    private JasyptEncryptionUtil jasyptEncryptionUtil;

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
                Account.builder().accountNumber("encrypted427502039102").bankCode(BankCode.KB.getBackCode()).customer(customer).build(),
                Account.builder().accountNumber("encrypted3333089607493").bankCode(BankCode.KAKAO.getBackCode()).customer(customer).build()
        );
        Page<Account> accountPage = new PageImpl<>(accounts, pageable, accounts.size());

        when(accountRepository.findAllByCustomerId(1L, pageable)).thenReturn(accountPage);
        when(jasyptEncryptionUtil.decrypt(anyString())).thenAnswer(invocation -> {
            String input = invocation.getArgument(0);
            return input.replace("encrypted", "");
        });

        // when
        Page<FindAccountRes> result = accountService.findAllAccountsByCustomerId(1L, pageable);

        // then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).getAccountNumber()).isEqualTo("********9102");
        assertThat(result.getContent().get(1).getAccountNumber()).isEqualTo("*********7493");
        assertThat(result.getTotalElements()).isEqualTo(2);

        verify(accountRepository).findAllByCustomerId(1L, pageable);
        verify(jasyptEncryptionUtil, times(2)).decrypt(anyString());
    }

    @DisplayName("계좌를 생성한다.")
    @Test
    void saveAccount_Success() {
        // Given
        Long customerId = 1L;
        SaveAccountReq saveAccountReq = SaveAccountReq.builder().build();
        saveAccountReq.setAccountNumber("42750204039102");
        saveAccountReq.setBankCode("004");

        Customer customer = Customer.builder().build();
        ReflectionTestUtils.setField(customer, "id", 1L);

        CheckAccountRes checkAccountRes = new CheckAccountRes("Test User");
        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(accountAuthService.checkAccount(any(CheckAccountReq.class))).thenReturn(checkAccountRes);
        when(jasyptEncryptionUtil.encrypt(anyString())).thenReturn("encryptedAccountNumber");

        // When
        accountService.saveAccount(customerId, saveAccountReq);

        // Then
        verify(customerRepository).findById(customerId);
        verify(accountRepository).save(any(Account.class));
        verify(accountAuthService).checkAccount(any(CheckAccountReq.class));

    }

    @DisplayName("계좌를 수정한다.")
    @Test
    void updateAccount_Success() {
        // Given
        Long accountId = 1L;
        String originalAccountNumber = "427502039102";
        String newAccountNumber = "123456789012";
        UpdateAccountReq updateAccountReq = new UpdateAccountReq(newAccountNumber, "004");
        Customer customer = Customer.builder().build();
        ReflectionTestUtils.setField(customer, "id", 1L);
        Account account = Account.builder()
                .accountNumber(originalAccountNumber)
                .bankCode("003")
                .customer(customer)
                .build();
        ReflectionTestUtils.setField(account, "id", accountId);

        when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));
        when(accountRepository.findAccountByAccountHash(anyLong(), anyString())).thenReturn(Optional.empty());
        when(accountAuthService.checkAccount(any(CheckAccountReq.class))).thenReturn(CheckAccountRes.builder().build());

        // 암호화 로직을 모방합니다. 실제 구현에서는 앞 8자리만 암호화하고 뒤 4자리는 그대로 붙입니다.
        when(jasyptEncryptionUtil.encrypt(newAccountNumber.substring(0, newAccountNumber.length() - 4)))
                .thenReturn("encrypted12345678");

        // When
        accountService.updateAccount(accountId, updateAccountReq);

        // Then
        // 예상되는 결과: 암호화된 앞 8자리 + 원래 뒤 4자리
        String expectedEncryptedNumber = "encrypted12345678" + newAccountNumber.substring(newAccountNumber.length() - 4);
        assertThat(account.getAccountNumber()).isEqualTo(expectedEncryptedNumber);
        assertThat(account.getBankCode()).isEqualTo("004");

        verify(accountRepository).findById(accountId);
        verify(accountAuthService).checkAccount(any(CheckAccountReq.class));
        verify(jasyptEncryptionUtil).encrypt(newAccountNumber.substring(0, newAccountNumber.length() - 4));
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
        Customer customer = Customer.builder().build();
        ReflectionTestUtils.setField(customer, "id", 1L);
        Account account = Account.builder()
                .accountNumber("0987654321")
                .bankCode("003")
                .customer(customer)
                .accountHash("dummyHash")
                .build();
        ReflectionTestUtils.setField(account, "id", accountId);

        when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));
        when(accountRepository.findAccountByAccountHash(anyLong(), anyString())).thenReturn(Optional.empty());

        // When
        accountService.deleteAccount(accountId);

        // Then
        verify(accountRepository).findById(accountId);
        verify(accountRepository).findAccountByAccountHash(eq(1L), eq("dummyHash"));
        assertThat(account.getIsDeleted()).isEqualTo(DisplayStatus.Y);
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