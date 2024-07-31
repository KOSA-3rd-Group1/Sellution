package shop.sellution.server.account.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import shop.sellution.server.account.domain.Account;

import java.time.LocalDateTime;

@Getter
@Builder
public class FindAccountDetailRes {

    private Long accountId;
    private Long customerId;
    private String customerName;
    @Setter
    private String accountNumber;
    private String bankCode;
    private LocalDateTime createdAt;

    public static FindAccountDetailRes fromEntity(Account account) {
        return FindAccountDetailRes.builder()
                .accountId(account.getId())
                .customerId(account.getCustomer().getId())
                .customerName(account.getCustomer().getName())
                .accountNumber(account.getAccountNumber())
                .bankCode(account.getBankCode())
                .createdAt(account.getCreatedAt())
                .build();
    }

}
