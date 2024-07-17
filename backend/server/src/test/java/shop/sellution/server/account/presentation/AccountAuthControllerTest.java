package shop.sellution.server.account.presentation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;
import shop.sellution.server.account.dto.request.CheckAccountReq;
import shop.sellution.server.account.dto.response.CheckAccountRes;
import shop.sellution.server.account.infrastructure.AccountAuthService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.webtestclient.WebTestClientRestDocumentation.document;

@WebFluxTest(AccountAuthController.class)
//@Import(SecurityConfig.class)
@ExtendWith({RestDocumentationExtension.class, MockitoExtension.class, SpringExtension.class})
@AutoConfigureRestDocs
@AutoConfigureDataJpa
class AccountAuthControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private AccountAuthService accountAuthService;

    @Test
    @DisplayName("실 계좌 인증 및 계좌 보유자가 맞는지 체크")
    void checkAccount_Success() throws Exception {
        // given
        CheckAccountReq req = new CheckAccountReq("004", "42750204039102");
        CheckAccountRes res = new CheckAccountRes("길재현");

        when(accountAuthService.checkAccount(any(CheckAccountReq.class)))
                .thenReturn(Mono.just(res));

        // when & then
        webTestClient.post()
                .uri("/accounts/auth/check-account")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.bankHolderName").isEqualTo("길재현")
                .consumeWith(document("Account/checkAccount",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("bankCode").description("은행 코드"),
                                fieldWithPath("accountNumber").description("계좌 번호")
                        ),
                        responseFields(
                                fieldWithPath("bankHolderName").description("계좌 소유자 이름")
                        )
                ));


    }

    @TestConfiguration
    @EnableWebFluxSecurity
    static class SecurityConfig {

        @Bean
        public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
            return http
                    .csrf(ServerHttpSecurity.CsrfSpec::disable)
                    .authorizeExchange(exchanges -> exchanges
                            .anyExchange().permitAll())
                    .build();
        }
    }
}