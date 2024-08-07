package shop.sellution.server.product.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.domain.Product;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class SaveProductReq {
    //private Long productId;
    private Long companyId;

    @NotBlank
    private String name;

    private String categoryName;

    @NotBlank
    private String productInformation;

    private List<String> detailImages;

    @NotNull
    private Integer cost;

    @NotNull
    private DisplayStatus isDiscount;

    private LocalDateTime discountStartDate;
    private LocalDateTime discountEndDate;

    @Min(0)
    private int discountRate;

    private String thumbnailImage; //썸네일 이미지는 한개만!
    private List<String> listImages;


    @NotNull
    private DeliveryType deliveryType;

    @NotNull
    private Integer stock;

    @NotNull
    @Builder.Default
    private DisplayStatus isVisible = DisplayStatus.Y;


    public Product toEntity(Company company, Category category, long code, int discountedPrice) {
        return Product.builder()
                .company(company)
                .name(name)
                .category(category)
                .productInformation(productInformation)
                .cost(cost)
                .isDiscount(isDiscount)
                .discountStartDate(discountStartDate)
                .discountEndDate(discountEndDate)
                .discountRate(discountRate)
                .deliveryType(deliveryType)
                .discountedPrice(discountedPrice) // 알아서 저장되서 계산
                .stock(stock)
                .code(code) //알아서 만들어줌
                .isVisible(DisplayStatus.Y)
                .build();
                // 이미지들 저장해야함
    }

    public void updateEntity(Product product, Category category, int discountedPrice) {
        product.setName(name);
        product.setCategory(category);
        product.setProductInformation(productInformation);
        product.setCost(cost);
        product.setIsDiscount(isDiscount);
        product.setDiscountStartDate(discountStartDate);
        product.setDiscountEndDate(discountEndDate);
        product.setDiscountRate(discountRate);
        product.setDeliveryType(deliveryType);
        product.setStock(stock);

    }

}
