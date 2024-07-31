package shop.sellution.server.product.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.domain.Product;

@Getter
@Setter
@Builder
public class FindCustomerProductRes {
    // 회원단 상품 목록 조회
    private Long productId;
    private String name;
    private String categoryName;
    private DeliveryType deliveryType;
    private int cost;
    private DisplayStatus isDiscount;
    private int discountRate;
    private int discountedPrice;
    private String thumbnailImage;
    private int stock;


    public static FindCustomerProductRes fromEntity(Product product, String thumbnailImage) {
        return FindCustomerProductRes.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .deliveryType(product.getDeliveryType())
                .categoryName(product.getCategory().getName())
                .cost(product.getCost())
                .isDiscount(product.getIsDiscount())
                .discountRate(product.getDiscountRate())
                .discountedPrice(product.getDiscountedPrice())
                .thumbnailImage(thumbnailImage)
                .stock(product.getStock())
                .build();
    }
}
