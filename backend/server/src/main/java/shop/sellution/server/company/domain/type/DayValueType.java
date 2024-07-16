package shop.sellution.server.company.domain.type;

public enum DayValueType {
    ONE(1),
    TWO(2),
    THREE(3),
    FOUR(4),
    FIVE(5);

    private final int value;

    DayValueType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static DayValueType fromValue(int value) {
        for (DayValueType dayValueType : DayValueType.values()) {
            if (dayValueType.value == value) {
                return dayValueType;
            }
        }
        throw new IllegalArgumentException("Invalid value: " + value);
    }
}
