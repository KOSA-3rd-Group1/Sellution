package shop.sellution.server.customer.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import shop.sellution.server.client.dto.request.FindClientIdReq;

@Getter
public class FindCustomerIdReq extends FindClientIdReq {

    @NotNull
    private Long companyId;
}
