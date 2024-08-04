package shop.sellution.server.account.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class CheckAccountRes {

    private final String bankHolderName;
}
