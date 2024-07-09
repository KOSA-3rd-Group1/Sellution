package shop.sellution.server.company.domain.type;

public enum SubscriptionType {
    MONTH("월단위"),
    COUNT("횟수단위");

    private final String description;

    SubscriptionType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }


}
