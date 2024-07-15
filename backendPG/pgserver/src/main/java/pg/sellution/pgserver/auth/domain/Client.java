package pg.sellution.pgserver.auth.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Builder
@AllArgsConstructor
public class Client {
    @Id
    @Column(nullable = false, length = 100, unique = true)
    private String name;

    @Column(nullable = false, length = 255, unique = true)
    private String apiKey;
}
