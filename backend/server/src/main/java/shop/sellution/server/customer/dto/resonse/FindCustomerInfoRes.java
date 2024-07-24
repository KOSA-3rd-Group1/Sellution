package shop.sellution.server.customer.dto.resonse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import shop.sellution.server.customer.domain.type.CustomerType;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FindCustomerInfoRes {
    private String name;
    private CustomerType customerType;
}
