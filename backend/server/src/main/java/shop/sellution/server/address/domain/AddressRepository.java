package shop.sellution.server.address.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByCustomer_Id(Long customerId);

    @Transactional
    @Modifying
    @Query("UPDATE Address a SET a.isDefaultAddress = 'N' WHERE a.customer.id = :customerId")
    void resetDefaultAddress(@Param("customerId") Long customerId);
}

