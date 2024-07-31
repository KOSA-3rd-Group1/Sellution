package shop.sellution.server.payment.dto.request;

import lombok.*;
import shop.sellution.server.payment.domain.type.PaymentStatus;

import java.time.LocalDate;

@Getter
@ToString
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FindPaymentHistoryCond {

    String orderCode;
    String userName;
    LocalDate startDate;
    LocalDate endDate;
    PaymentStatus status;
}
