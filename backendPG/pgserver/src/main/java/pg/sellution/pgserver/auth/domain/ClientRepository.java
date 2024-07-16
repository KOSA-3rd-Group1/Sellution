package pg.sellution.pgserver.auth.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client,Long> {

    // client의 name으로 client 조회
    Client findByName(String name);

}
