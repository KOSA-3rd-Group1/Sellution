package shop.sellution.server.auth.dto;

import lombok.Getter;
import lombok.ToString;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@ToString
public class CustomUserDetails extends User {

    public CustomUserDetails(Long userId, Long companyId, String username, String password, List<String> roles) {
        super(username, password, roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toSet()));
        this.userId = userId;
        this.companyId = companyId;
        this.roles = roles;
    }

    private Long userId;
    private Long companyId;
    private List<String> roles;

    public Map<String, Object> getClaims() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", this.userId);
        claims.put("companyId", this.companyId);
        claims.put("username", this.getUsername());
        claims.put("roles", this.roles);
        return claims;
    }
}
