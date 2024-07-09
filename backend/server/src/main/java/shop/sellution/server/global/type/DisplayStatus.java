package shop.sellution.server.global.type;

public enum DisplayStatus {
    N(false),
    Y(true);

    private final boolean value;

    DisplayStatus(boolean value) {
        this.value = value;
    }

    public boolean getValue() {
        return value;
    }

    public static DisplayStatus fromBoolean(boolean value) {
        return value ? Y : N;
    }
}