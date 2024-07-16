package pg.sellution.pgserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class PgserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(PgserverApplication.class, args);
	}

}
