package shop.sellution.server.category.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.company.domain.Company;

import static shop.sellution.server.company.domain.QCompany.company;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SaveCategoryReq {

    private Long companyId;
    @NotBlank
    private String name;

    public Category toEntity(Company company) {
        return Category.builder()
                .company(company)
                .name(name)
                .build();
    }

    // 엔티티 업데이트
    public void updateEntity(Category category) {
        category.setName(this.name);
    }


}
