package pg.sellution.pgserver.auth.util;

import lombok.*;

import java.io.Serializable;


@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class AccessToken implements Serializable {
    private String clientName;
    private String permission;
    private Integer price;
    private String issuedIp;
}
