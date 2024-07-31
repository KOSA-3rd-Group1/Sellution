package shop.sellution.server.payment.dto.request;

import lombok.Getter;
import shop.sellution.server.payment.domain.type.PaymentStatus;

import java.time.LocalDateTime;

@Getter
public class FindPaymentHistoryCond {

    String orderCode;
    String userName;
    LocalDateTime startDate;
    LocalDateTime endDate;
    PaymentStatus status;
}
