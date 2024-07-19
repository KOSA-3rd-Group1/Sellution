package shop.sellution.server.category.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.category.dto.response.FindCustomerCategoryRes;
import shop.sellution.server.global.type.DisplayStatus;

import java.util.List;

public interface CustomerCategoryService {
    List<FindCustomerCategoryRes> findAllCategories(String name);
}
