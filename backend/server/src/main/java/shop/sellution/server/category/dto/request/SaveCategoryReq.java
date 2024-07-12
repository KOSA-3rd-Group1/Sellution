package shop.sellution.server.category.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import shop.sellution.server.category.domain.Category;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SaveCategoryReq {

    @NotBlank
    private String name;

    public Category toEntity() {
        return Category.builder()
                .name(name)
                .build();
    }

    // 엔티티 업데이트
    public void updateEntity(Category category) {
        category.setName(this.name);
    }


}
