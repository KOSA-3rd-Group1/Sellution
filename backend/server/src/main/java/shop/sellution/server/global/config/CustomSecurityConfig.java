package shop.sellution.server.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CustomSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)  throws Exception {

        //CORS 설정
        http.cors(httpSecurityCorsConfigurer -> {
            httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource());
        });

        //session 설정
        http.sessionManagement(sessionConfig -> {
            sessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        });

        //CSRF 설정
        http.csrf(config -> config.disable());

        //Form 로그인 방식 disable
        http.formLogin(config -> config.disable()); //UsernamePasswordAuthenticationFilter를 커스텀해서 사용

        //http basic 인증 방식 disable
        http.httpBasic(config -> config.disable());

        http.authorizeHttpRequests((auth) -> auth
                .requestMatchers("/api", "/", "/api/auth/login", "/api/auth/reissue").permitAll()
                .requestMatchers("/admin").hasRole("CLIENT")
                .anyRequest().permitAll());
//                .anyRequest().authenticated());

        return http.build();
    }

    //CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
//        configuration.setAllowedOrigins(Collections.singletonList("http://localhosg:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
