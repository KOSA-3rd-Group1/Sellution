package pg.sellution.pgserver.auth.application;

import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import pg.sellution.pgserver.auth.domain.Client;
import pg.sellution.pgserver.auth.domain.ClientRepository;
import pg.sellution.pgserver.auth.util.AccessToken;

import javax.crypto.SecretKey;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccessTokenServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private RedisTemplate<String, AccessToken> redisTemplate;

    @Mock
    private ValueOperations<String, AccessToken> valueOperations;

    private AccessTokenService accessTokenService;

    @BeforeEach
    void setUp() {
        SecretKey key = Jwts.SIG.HS256.key().build();
        accessTokenService = new AccessTokenService(redisTemplate, Duration.ofMinutes(30), key.toString(), clientRepository);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @DisplayName("토큰 생성 성공")
    @Test
    void generateToken_Success() {
        // given
        String name = "testClient";
        String apiKey = "testApiKey";
        String permission = "payment";
        Integer price = 1000;
        String ip = "0:0:0:0:0:0:0:1";

        Client client = Client.builder()
                .name(name)
                .apiKey(apiKey)
                .build();

        when(clientRepository.findByName(name)).thenReturn(client);

        // when
        String token = accessTokenService.generateToken(name, apiKey, permission, price, ip);

        // then
        assertNotNull(token);
        verify(valueOperations).set(anyString(), any(AccessToken.class), any(Duration.class));
    }

}