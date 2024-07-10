package shop.sellution.server.global.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@Getter
@RequiredArgsConstructor
public enum UserRole implements GrantedAuthority {
    ROLE_CLIENT("CLIENT"),
    ROLE_CUSTOMER("CUSTOMER");

    private final String roleName;

    @Override
    public String getAuthority() {
        return "ROLE_" + name();
    }
}
