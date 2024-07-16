package shop.sellution.server.customer.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import shop.sellution.server.client.dto.request.FindClientPasswordReq;

@Getter
public class FindCustomerPasswordReq extends FindClientPasswordReq {

    @NotNull
    private Long companyId;
}
