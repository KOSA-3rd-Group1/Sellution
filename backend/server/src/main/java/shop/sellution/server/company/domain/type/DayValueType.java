package shop.sellution.server.company.domain.type;

import java.time.DayOfWeek;

public enum DayValueType {
    MON,TUE,WED,THU,FRI;

    public DayOfWeek changeToDayOfWeek() {
        return switch (this) {
            case MON -> DayOfWeek.MONDAY;
            case TUE -> DayOfWeek.TUESDAY;
            case WED -> DayOfWeek.WEDNESDAY;
            case THU -> DayOfWeek.THURSDAY;
            case FRI -> DayOfWeek.FRIDAY;
        };
    }
}
