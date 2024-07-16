package shop.sellution.server.global.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@Getter
@RequiredArgsConstructor
public enum UserRole implements GrantedAuthority {
    ROLE_CLIENT("ROLE_CLIENT"),
    ROLE_CUSTOMER("ROLE_CUSTOMER");

    private final String roleName;

    @Override
    public String getAuthority() {
        return name();
    }
}
