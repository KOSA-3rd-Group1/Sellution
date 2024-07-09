package shop.sellution.server.global.type;

public enum DeliveryType {
    ONETIME("단건"),
    SUBSCRIPTION("정기"),
    BOTH("단건 + 정기");

    private final String description;

    DeliveryType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
