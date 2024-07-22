package shop.sellution.server.payment.domain.type;

public enum TokenType {
    PAYMENT("payment"),PAYMENT_CANCEL("payment-cancel");

    private final String permission;
    TokenType(String permission) {
        this.permission = permission;
    }
    public String getPermission() {
        return permission;
    }

}
