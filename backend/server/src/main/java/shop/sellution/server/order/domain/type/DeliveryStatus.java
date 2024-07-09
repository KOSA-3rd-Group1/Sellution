package shop.sellution.server.order.domain.type;

public enum DeliveryStatus {
    BEFORE_DELIVERY("배송전"),
    IN_PROGRESS("배송중"),
    COMPLETE("배송완료");

    DeliveryStatus(String s) {
    }
}
