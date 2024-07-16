package shop.sellution.server.client.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    // Id로 고객 조회
    Optional<Client> findById(Long id);

    // Username 으로 고객 조회 - 로그인 시 사용
    Optional<Client> findByUsername(String username);

    //고객 유저아이디 중복 확인용
    boolean existsByUsername(String username);

    // 고객 전화 번호 중복 확인
    boolean existsByPhoneNumber(String phoneNumber);

    // 고객 전화 번호로 고객 조회
    Optional<Client> findByPhoneNumber(String phoneNumber);
}
