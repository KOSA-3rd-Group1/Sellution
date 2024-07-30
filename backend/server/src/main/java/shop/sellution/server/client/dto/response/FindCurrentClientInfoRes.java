package shop.sellution.server.client.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import shop.sellution.server.customer.domain.type.CustomerType;
import shop.sellution.server.global.type.UserRole;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FindCurrentClientInfoRes {
    private Long id;
    private Long companyId;
    private String name;
    private UserRole userRole;
    private String contractCompanyName;
}
