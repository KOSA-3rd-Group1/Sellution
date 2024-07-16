package shop.sellution.server.notification.domain.type;

public enum MessageType {
    ORDER_COMPLETE("주문완료"),
    ORDER_CANCEL("주문취소"),
    PAYMENT_COMPLETE("결제완료"),
    PAYMENT_CANCEL("결제취소");

    private String description;

    MessageType(String description) {
    }
}