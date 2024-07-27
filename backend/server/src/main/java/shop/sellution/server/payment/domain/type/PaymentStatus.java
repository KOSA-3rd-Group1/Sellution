package shop.sellution.server.payment.domain.type;

public enum PaymentStatus {
    COMPLETE("결제완료"),
    PENDING("결제실패"),
    CANCEL("결제취소");

    private final String description;

    PaymentStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}