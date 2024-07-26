package shop.sellution.server.order.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class CalculateRes {
    private int thisMonthDeliveryCount;
    private int thisMonthPrice;
    private int totalDeliveryCount;
    private int totalPrice;
    private LocalDate deliveryNextDate;
    private LocalDate deliveryEndDate;

}
