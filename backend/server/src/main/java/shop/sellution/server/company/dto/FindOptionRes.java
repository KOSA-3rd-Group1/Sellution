package shop.sellution.server.company.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import shop.sellution.server.company.domain.DayOption;
import shop.sellution.server.company.domain.MonthOption;
import shop.sellution.server.company.domain.WeekOption;

@Getter
@Setter
@Builder
public class FindOptionRes {
    private Long id;
    private String value;

    public static FindOptionRes fromEntity(DayOption dayOption) {
        return FindOptionRes.builder()
                .id(dayOption.getId())
                .value(dayOption.getDayValue().name())
                .build();
    }

    public static FindOptionRes fromEntity(WeekOption weekOption) {
        return FindOptionRes.builder()
                .id(weekOption.getId())
                .value(weekOption.getWeekValue().toString())
                .build();
    }

    public static FindOptionRes fromEntity(MonthOption monthOption) {
        return FindOptionRes.builder()
                .id(monthOption.getId())
                .value(monthOption.getMonthValue().toString())
                .build();
    }
}
