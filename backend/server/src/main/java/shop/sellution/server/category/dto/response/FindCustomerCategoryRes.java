package shop.sellution.server.category.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import shop.sellution.server.category.domain.Category;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FindCustomerCategoryRes { //productCount가 필요없기 때문에 따로 dto생성
    private Long categoryId;
    private String name;

    public static FindCustomerCategoryRes fromEntity(Category category) {
        return FindCustomerCategoryRes.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .build();
    }
}
