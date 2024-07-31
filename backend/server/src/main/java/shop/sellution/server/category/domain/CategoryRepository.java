package shop.sellution.server.category.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import shop.sellution.server.global.type.DisplayStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    //Category findByName(String name);
    @Query("SELECT c FROM Category c WHERE c.company.companyId = :companyId " +
            "AND (:isVisible IS NULL OR c.isVisible = :isVisible)")
    Page<Category> findByCompanyCompanyIdAndIsVisible(@Param("companyId") Long companyId,
                                                      @Param("isVisible") DisplayStatus isVisible,
                                                      Pageable pageable);
    List<Category> findAllById(Iterable<Long> ids);
    Page<Category> findByCompanyCompanyId(Long companyId, Pageable pageable);
    Optional<Category> findByName(String name);

}
