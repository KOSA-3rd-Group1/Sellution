package shop.sellution.server.category.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.category.domain.CustomerCategoryRepositoryCustom;
import shop.sellution.server.category.dto.response.FindCustomerCategoryRes;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.type.DisplayStatus;

import java.util.List;

import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_COMPANY_ID;
import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_COMPANY_NAME;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerCategoryServiceImpl implements CustomerCategoryService{
    private final CustomerCategoryRepositoryCustom customerCategoryRepositoryCustom;
    private final CompanyRepository companyRepository;

    @Transactional(readOnly = true)
    @Override
    public List<FindCustomerCategoryRes> findAllCategories(Long companyId) {
        //companyId가 유효하지 않을 때 예외처리
        if(!companyRepository.existsById(companyId)){
            throw new BadRequestException(NOT_FOUND_COMPANY_ID);
        }
        return customerCategoryRepositoryCustom.findAllCategories(companyId, DisplayStatus.Y)
                .stream()
                .map(FindCustomerCategoryRes::fromEntity)
                .toList();
    }


}
