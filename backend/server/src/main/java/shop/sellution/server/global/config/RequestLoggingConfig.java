package shop.sellution.server.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import shop.sellution.server.global.filter.RequestLoggingFilter;

@Configuration
public class RequestLoggingConfig {

    private static final int MAX_PAYLOAD_LENGTH = 1000;

    @Bean
    public RequestLoggingFilter loggingFilter() {
        RequestLoggingFilter filter = new RequestLoggingFilter();
        filter.setIncludePayload(true);
        filter.setIncludeQueryString(true);
        filter.setMaxPayloadLength(MAX_PAYLOAD_LENGTH);
        return filter;
    }
}
