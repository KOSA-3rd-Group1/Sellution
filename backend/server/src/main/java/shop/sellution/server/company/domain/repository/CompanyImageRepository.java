package shop.sellution.server.company.domain.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyImage;
import shop.sellution.server.company.domain.type.ImagePurposeType;

import java.util.List;
import java.util.Optional;

public interface CompanyImageRepository extends JpaRepository<CompanyImage, Long> {
    List<CompanyImage> findAllByCompany(Company company);
    Optional<CompanyImage> findByCompanyAndPurposeOfUse(Company company, ImagePurposeType purposeOfUse);
    List<CompanyImage> findAllByCompanyAndPurposeOfUse(Company company, ImagePurposeType purposeOfUse);
}
