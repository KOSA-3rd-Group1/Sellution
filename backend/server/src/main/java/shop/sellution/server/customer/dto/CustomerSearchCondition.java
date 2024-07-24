package shop.sellution.server.customer.dto;

import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.customer.domain.type.CustomerSortType;
import shop.sellution.server.customer.domain.type.CustomerType;

import java.time.LocalDateTime;

@Getter
@Builder
public class CustomerSearchCondition {
    private Long customerId;
    private String customerUsername; // 회원 아이디
    private String customerName; // 회원명
    private String customerPhoneNumber; // 회원 휴대폰 번호
    private String customerCreatedAt; // 가입일
    private CustomerType customerType; // 회원 유형
    private LocalDateTime lastestDeliveryDate; // 최신 배송 일자
    private LocalDateTime startDate; // 조회하려는 시작 날짜
    private LocalDateTime endDate; // 조회하려는 마지막 날짜

    private CustomerSortType sortOption;
}
