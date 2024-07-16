package pg.sellution.pgserver.account.infrastructure;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import pg.sellution.pgserver.account.dto.request.CheckAccountReq;
import pg.sellution.pgserver.account.dto.response.CheckAccountRes;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;


import java.io.IOException;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountAuthServiceTest {

    private static MockWebServer mockWebServer;
    private AccountAuthService accountAuthService;

    @Mock
    private IamPortTokenClient iamPortTokenClient;


    @BeforeAll
    static void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
    }

    @AfterAll
    static void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @BeforeEach
    void initialize() {
        String baseUrl = String.format("http://localhost:%s", mockWebServer.getPort());
        WebClient webClient = WebClient.create(baseUrl);
        accountAuthService = new AccountAuthService(iamPortTokenClient, webClient);
    }

    @Test
    @DisplayName("실 계좌 인증 및 계좌 보유자가 맞는지 체크")
    void checkAccount_Success() throws Exception {
        // given
        CheckAccountReq req = new CheckAccountReq("004", "42750204039102");
        String accessToken = "test-token";
        String expectedResponse = "{\"response\":{\"bank_holder\":\"길재현\"}}";

        mockWebServer.enqueue(new MockResponse()
                .setBody(expectedResponse)
                .addHeader("Content-Type", "application/json"));

        // when
        when(iamPortTokenClient.getApiAccessToken()).thenReturn(Mono.just(accessToken));
        Mono<CheckAccountRes> result = accountAuthService.checkAccount(req);

        // then
        StepVerifier.create(result)
                .expectNextMatches(res -> res.getBankHolderName().equals("길재현"))
                .verifyComplete();
    }
}