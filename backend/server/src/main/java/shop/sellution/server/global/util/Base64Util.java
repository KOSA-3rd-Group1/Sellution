package shop.sellution.server.global.util;

import java.util.Base64;

public class Base64Util {
    public static String encodeToString(byte[] data) {
        return Base64.getEncoder().encodeToString(data);
    }
}
