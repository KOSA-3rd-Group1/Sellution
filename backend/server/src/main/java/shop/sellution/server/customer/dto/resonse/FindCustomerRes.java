package shop.sellution.server.customer.dto.resonse;

import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.type.CustomerType;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Builder
public class FindCustomerRes {
    private Long customerId;
    private String customerUsername; // 회원 아이디
    private String customerName; // 회원명
    private String customerPhoneNumber; // 회원 휴대폰 번호
    private String customerCreatedAt; // 가입일
    private CustomerType customerType; // 회원 유형
    private LocalDateTime latestDeliveryDate; // 최신 배송 일자

    public static FindCustomerRes fromEntity(Customer customer) {
        return FindCustomerRes.builder()
                .customerId(customer.getId())
                .customerUsername(customer.getUsername())
                .customerName(customer.getName())
                .customerPhoneNumber(customer.getPhoneNumber())
                .customerCreatedAt(customer.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .customerType(customer.getType())
                .latestDeliveryDate(customer.getLatestDeliveryDate())
                .build();
    }
}
