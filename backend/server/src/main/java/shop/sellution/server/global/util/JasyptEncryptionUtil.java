package shop.sellution.server.global.util;

import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.springframework.beans.factory.annotation.Value;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.springframework.stereotype.Component;

@Component
public class JasyptEncryptionUtil {

    private final PooledPBEStringEncryptor encryptor;

    public JasyptEncryptionUtil(@Value("${jasypt.encryptor.password}") String password) {
        encryptor = new PooledPBEStringEncryptor();
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();
        config.setPassword(password); // 암호화에 사용할 비밀번호를 설정
        config.setAlgorithm("PBEWithMD5AndDES"); // 암호화 알고리즘 설정
        config.setKeyObtentionIterations("1000"); // 키생성반복(해싱) 회수 설정
        config.setPoolSize("1");// 암호화 풀 사이즈 설정
        config.setProviderName("SunJCE"); // 암호화 제공자를 지정 , "SunJCE"는 Java의 표준 암호화 제공자
        config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator"); // 솔트 생성기를 지정
        config.setStringOutputType("base64"); // 암호화된 결과물의 출력 형식을 지정
        encryptor.setConfig(config);
    }

    public String encrypt(String value) {
        return encryptor.encrypt(value);
    }

    public String decrypt(String encryptedValue) {
        return encryptor.decrypt(encryptedValue);
    }
}
