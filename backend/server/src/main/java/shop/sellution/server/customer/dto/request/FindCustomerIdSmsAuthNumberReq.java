package shop.sellution.server.customer.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import shop.sellution.server.client.dto.request.FindClientIdSmsAuthNumberReq;

@Getter
public class FindCustomerIdSmsAuthNumberReq extends FindClientIdSmsAuthNumberReq {

    @NotNull
    private Long companyId;
}
