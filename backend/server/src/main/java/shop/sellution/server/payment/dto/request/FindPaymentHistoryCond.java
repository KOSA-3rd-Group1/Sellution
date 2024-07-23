package shop.sellution.server.payment.dto.request;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class FindPaymentHistoryCond {

    Long orderId;
    LocalDateTime startDate;
    LocalDateTime endDate;
}
