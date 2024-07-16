package shop.sellution.server.event.domain.type;

public enum TargetCustomerType {
    NEW("신규"),
    NORMAL("일반"),
    DORMANT("휴면"),
    ALL("전체");

    TargetCustomerType(String s) {
    }
}
