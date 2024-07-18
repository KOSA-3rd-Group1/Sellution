package shop.sellution.server.customer.dto.resonse;


import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.customer.domain.Customer;

@Getter
@Builder
public class FindCustomerSummaryRes {

    private Long id;

    private String name;

    private String phoneNumber;

    public static FindCustomerSummaryRes fromEntity(Customer customer){
        return FindCustomerSummaryRes.builder()
                .id(customer.getId())
                .name(customer.getName())
                .phoneNumber(customer.getPhoneNumber())
                .build();
    }

}
