package pg.sellution.pgserver.auth.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreateTokenReq {
    private String name;
    private String apiKey;
    private String permission;
    private Integer price;
    private String clientIp;
}
