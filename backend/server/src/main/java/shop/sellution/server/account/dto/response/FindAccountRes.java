package shop.sellution.server.account.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.account.domain.Account;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class FindAccountRes {

    private final Long accountId;
    private final Long customerId;
    private final String accountNumber;
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
}
