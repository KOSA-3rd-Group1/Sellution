package shop.sellution.server.customer.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import shop.sellution.server.client.dto.request.CheckClientUsernameReq;

@Getter
public class CheckCustomerUsernameReq extends CheckClientUsernameReq {

    @NotNull
    private Long companyId;
}
