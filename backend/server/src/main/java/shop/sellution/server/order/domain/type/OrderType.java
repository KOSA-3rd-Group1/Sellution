package shop.sellution.server.order.domain.type;

public enum OrderType {
    ONETIME("단건"),
    MONTH_SUBSCRIPTION("월 단위 정기주문"),
    COUNT_SUBSCRIPTION("횟수 단위 정기주문");

    OrderType(String s) {
    }

    public boolean isMonthSubscription() {
        return this == MONTH_SUBSCRIPTION;
    }
    public boolean isCountSubscription() {
        return this == COUNT_SUBSCRIPTION;
    }
    public boolean isOnetime() {
        return this == ONETIME;
    }
}
