package shop.sellution.server.order.domain.type;

public enum OrderStatus {
    HOLD("승인대기"),
    APPROVED("승인"),
    CANCEL("주문취소");

    OrderStatus(String s) {
    }
}
