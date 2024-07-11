package shop.sellution.server.category.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.global.type.DisplayStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FindCategoryRes {
    private Long categoryId;
    private String name;
    private int productCount;
    private DisplayStatus isVisible;

    // 엔티티를 DTO로 변환
    public static FindCategoryRes fromEntity(Category category, int productCount) {
        return FindCategoryRes.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .productCount(productCount)
                .isVisible(category.getIsVisible())
                .build();
    }
}
