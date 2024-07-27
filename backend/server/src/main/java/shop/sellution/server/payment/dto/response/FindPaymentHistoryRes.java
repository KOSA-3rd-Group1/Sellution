package shop.sellution.server.payment.dto.response;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.type.OrderType;
import shop.sellution.server.payment.domain.type.PaymentStatus;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class FindPaymentHistoryRes {

    private Long paymentHisoryId;
    private Long customerId;
    private int price;
    private int remainingPayCount; // 남은 결제 횟수
    private int totalCountForPayment; // 총 결제해야하는 횟수
    private LocalDateTime paymentDate;
    private PaymentStatus status;

}
