package shop.sellution.server.product.dto;

import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.product.domain.Product;

@Getter
@Builder
public class ProductSummaryDto {
    private Long id;
    private String name;
    private String categoryName;
    private int price;
    private String thumbnailUrl;

    public static ProductSummaryDto fromEntity(Product product, String thumbnailUrl) {
        return ProductSummaryDto.builder()
                .id(product.getProductId())
                .name(product.getName())
                .categoryName(product.getCategory().getName())
                .price(product.getCost())
                .thumbnailUrl(thumbnailUrl)
                .build();
    }


}
