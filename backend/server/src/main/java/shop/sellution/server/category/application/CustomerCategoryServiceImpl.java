package shop.sellution.server.category.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.category.domain.CustomerCategoryRepositoryCustom;
import shop.sellution.server.category.dto.response.FindCustomerCategoryRes;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.global.type.DisplayStatus;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerCategoryServiceImpl implements CustomerCategoryService{
    private final CustomerCategoryRepositoryCustom customerCategoryRepositoryCustom;
    private final CompanyRepository companyRepository;

    @Transactional(readOnly = true)
    @Override
    public List<FindCustomerCategoryRes> findAllCategories(String name) {
        Long companyId = companyRepository.findByName(name).orElseThrow().getCompanyId();
        List<Category> categories = customerCategoryRepositoryCustom.findAllCategories(companyId, DisplayStatus.Y);
        return categories.stream()
                .map(FindCustomerCategoryRes::fromEntity)
                .toList();
    }


}
