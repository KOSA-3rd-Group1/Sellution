package shop.sellution.server.customer.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import shop.sellution.server.client.dto.request.FindClientPasswordSmsAuthNumberReq;

@Getter
public class FindCustomerPasswordSmsAuthNumberReq extends FindClientPasswordSmsAuthNumberReq {

    @NotNull
    private Long companyId;
}
