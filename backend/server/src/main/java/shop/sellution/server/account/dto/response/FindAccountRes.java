package shop.sellution.server.account.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import shop.sellution.server.account.domain.Account;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@Slf4j
public class FindAccountRes {

    private final Long accountId;
    private final Long customerId;
    private String accountNumber;
    private final String bankCode;
    private final LocalDateTime createdAt;

    // 엔티티로부터 DTO로 변환하는 정적 팩토리 메서드
    public static FindAccountRes fromEntity(Account account) {
        return FindAccountRes.builder()
                .accountId(account.getId())
                .customerId(account.getCustomer().getId())
                .accountNumber(account.getAccountNumber())
                .bankCode(account.getBankCode())
                .createdAt(account.getCreatedAt())
                .build();
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }
}
