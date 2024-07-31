package shop.sellution.server.payment.dto.response;

import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.order.domain.type.OrderType;
import shop.sellution.server.payment.domain.PaymentHistory;
import shop.sellution.server.payment.domain.type.PaymentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class FindPaymentHistoryDetailRes {

    private Long paymentHisoryId;
    private int price;
    private int remainingPayCount; // 남은 결제 횟수
    private int totalCountForPayment; // 총 결제해야하는 횟수
    private LocalDateTime paymentDate;
    private PaymentStatus status;
    private String accountNumber;
    private OrderType orderType;
    private LocalDate thisSubMonthStartDate;
    private LocalDate thisSubMonthEndDate;
    private Integer deliveryPerPrice;
    private Integer thisMonthDeliveryCount;


    public static FindPaymentHistoryDetailRes fromEntity(PaymentHistory paymentHistory) {
        return FindPaymentHistoryDetailRes.builder()
                .paymentHisoryId(paymentHistory.getId())
                .price(paymentHistory.getPrice())
                .remainingPayCount(paymentHistory.getRemainingPaymentCount())
                .totalCountForPayment(paymentHistory.getTotalPaymentCount())
                .paymentDate(paymentHistory.getCreatedAt())
                .status(paymentHistory.getStatus())
                .accountNumber(paymentHistory.getAccount().getAccountNumber())
                .orderType(paymentHistory.getType())
                .thisSubMonthStartDate(paymentHistory.getThisSubMonthStartDate())
                .thisSubMonthEndDate(paymentHistory.getThisSubMonthEndDate())
                .deliveryPerPrice(paymentHistory.getDeliveryPerPrice())
                .thisMonthDeliveryCount(paymentHistory.getThisMonthDeliveryCount())
                .build();
    }
}
