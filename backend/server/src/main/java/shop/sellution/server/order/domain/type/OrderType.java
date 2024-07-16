package shop.sellution.server.order.domain.type;

public enum OrderType {
    ONETIME("단건"),
    MONTH_SUBSCRIPTION("월 단위 정기주문"),
    COUNT_SUBSCRIPTION("횟수 단위 정기주문");

    OrderType(String s) {
    }
}
