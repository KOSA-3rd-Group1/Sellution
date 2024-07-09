package shop.sellution.server.payment.domain.type;

public enum PaymentStatus {
    COMPLETE("결제완료"),
    CANCEL_REFUND("주문취소로 인한 결제취소"),
    FAIL_MONEY("돈이 부족해서 결제 실패");

    private final String description;

    PaymentStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}