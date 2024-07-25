package shop.sellution.server.product.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import shop.sellution.server.product.domain.ProductImageType;

@Getter
@AllArgsConstructor
public class ProductImageSummary {
    private Long imageId;
    private Long productId;
    private String imageUrl;
    private ProductImageType purposeOfUse;
}
