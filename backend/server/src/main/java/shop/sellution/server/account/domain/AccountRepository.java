package shop.sellution.server.account.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    // 고객의 삭제되지않은 모든 계좌 조회
    @Query(
            """
                    select a from Account a
                    join fetch a.customer
                    where a.customer.id = :customerId
                    and a.isDeleted = 'N'
                    """
    )
    Page<Account> findAllByCustomerId(Long customerId, Pageable pageable);

    @Query("""
            select a from Account a
            join fetch a.customer
            where a.id = :accountId
            """)
    Optional<Account> findById(Long accountId);

    @Query("""
        SELECT a FROM Account a
            WHERE a.accountHash = :accountHash
            and a.customer.id = :customerId
        """)
    Optional<Account> findAccountByAccountHash(@Param("customerId")Long customerId,@Param("accountHash") String accountHash);

}
