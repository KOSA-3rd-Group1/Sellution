package shop.sellution.server.order.dto.request;

import lombok.Getter;
import shop.sellution.server.company.domain.type.DayValueType;

import java.time.LocalDate;
import java.util.List;

@Getter
public class CalculateReq {
    List<DayValueType> selectedDays;
    Integer weekOptionValue;
    Integer monthOptionValue;
    Integer perPrice;
    LocalDate startDate;
}
