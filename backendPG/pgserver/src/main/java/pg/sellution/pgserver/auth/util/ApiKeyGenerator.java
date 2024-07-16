package pg.sellution.pgserver.auth.util;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;

public class ApiKeyGenerator {

    private static final SecureRandom secureRandom = new SecureRandom();

    public static String generateApiKey() {
        // UUID 생성
        UUID uuid = UUID.randomUUID();

        // 16바이트 랜덤 데이터 생성
        byte[] randomBytes = new byte[16];
        secureRandom.nextBytes(randomBytes);

        // UUID와 랜덤 데이터를 결합
        byte[] combined = new byte[32];
        System.arraycopy(uuid.toString().getBytes(), 0, combined, 0, 16);
        System.arraycopy(randomBytes, 0, combined, 16, 16);

        // Base64 인코딩 (URL-safe 버전 사용)
        String encoded = Base64.getUrlEncoder().withoutPadding().encodeToString(combined);

        // 마지막으로 prefix 추가 (선택사항)
        return "ak_" + encoded;
    }

    // api key 생성한거 콘솔로 출력해보기 -> 직접 DB에 클라이언트 추가하기 위함.
    public static void main(String[] args) {
        String apiKey = generateApiKey();
        System.out.println("Generated API Key: " + apiKey);
        System.out.println("Length: " + apiKey.length());
    }
}