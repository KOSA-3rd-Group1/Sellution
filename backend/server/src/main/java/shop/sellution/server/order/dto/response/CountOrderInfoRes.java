package shop.sellution.server.order.dto.response;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CountOrderInfoRes {

    private LocalDate deliveryNextDate;
    private LocalDate deliveryEndDate;
}
