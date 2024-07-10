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
import shop.sellution.server.account.dto.response.FindAccountRes;
import shop.sellution.server.customer.domain.Customer;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private AccountServiceImpl accountService;

    @DisplayName("고객 ID로 계좌 목록을 조회한다")
    @Test
    void findAllAccountsByCustomerId_Success() {
        // given
        Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());
        Customer customer = Customer.builder().build();
        ReflectionTestUtils.setField(customer, "id", 1L);

        List<Account> accounts = List.of(
                Account.builder().accountNumber("427502039102").bankCode(BankCode.KB).customer(customer).build(),
                Account.builder().accountNumber("3333089607493").bankCode(BankCode.KAKAO).customer(customer).build()
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

}