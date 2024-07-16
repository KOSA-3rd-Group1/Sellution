package shop.sellution.server.sms.dto;

import lombok.Getter;

@Getter
//@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RedisSmsAuthNumberValue {

    private String authNumber;
    private int attemptCount;
    private boolean blocked;

//    public static RedisSmsAuthNumberValue createNew() {
//        return new RedisSmsAuthNumberValue();
//    }

    public static RedisSmsAuthNumberValue fromString(String value) {
        String[] parts = value.split("\\|");
        RedisSmsAuthNumberValue info = new RedisSmsAuthNumberValue();
        if (parts.length >= 1) info.authNumber = parts[0];
        if (parts.length >= 2) info.attemptCount = Integer.parseInt(parts[1]);
        if (parts.length >= 3) info.blocked = Boolean.parseBoolean(parts[2]);
        return info;
    }

    public RedisSmsAuthNumberValue() {
        this.attemptCount = 0;
        this.blocked = false;
    }

    public void recordNewAttempt() {
        this.attemptCount++;
    }

    public void updateAuthNumber(String newAuthNumber) {
        this.authNumber = newAuthNumber;
    }

    public void markAsBlocked() {
        this.blocked = true;
    }

    @Override
    public String toString() {
        return String.join("|", authNumber, String.valueOf(attemptCount), String.valueOf(blocked));
    }
}
