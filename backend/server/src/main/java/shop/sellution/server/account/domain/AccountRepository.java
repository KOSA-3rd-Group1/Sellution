package shop.sellution.server.account.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Page<Account> findAllByCustomerId(Long customerId, Pageable pageable);

    @Query("""
            select a from Account a
            join fetch a.customer
            where a.id = :accountId
            """)
    Optional<Account> findById(Long accountId);
}
