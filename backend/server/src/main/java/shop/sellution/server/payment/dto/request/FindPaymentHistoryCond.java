package shop.sellution.server.payment.dto.request;

import lombok.Getter;
import shop.sellution.server.payment.domain.type.PaymentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class FindPaymentHistoryCond {

    String orderCode;
    String userName;
    LocalDate startDate;
    LocalDate endDate;
    PaymentStatus status;
}
