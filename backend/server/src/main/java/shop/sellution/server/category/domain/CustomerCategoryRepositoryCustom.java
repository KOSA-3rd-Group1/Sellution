package shop.sellution.server.category.domain;

import shop.sellution.server.global.type.DisplayStatus;

import java.util.List;

public interface CustomerCategoryRepositoryCustom {
    List<Category> findAllCategories(Long companyId, DisplayStatus displayStatus);
}
