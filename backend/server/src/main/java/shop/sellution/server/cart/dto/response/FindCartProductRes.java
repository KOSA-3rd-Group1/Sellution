package shop.sellution.server.cart.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.domain.Product;

@Getter
@Setter
@Builder
public class FindCartProductRes {
    private Long productId;
    private String name;
    private String categoryName;
    private DeliveryType deliveryType;
    private int cost;
    private Integer quantity;   //Integer?
    private DisplayStatus isDiscount;
    private int discountRate;
    private int discountedPrice;
    private String thumbnailImage;
    private int stock; //TODO: 장바구니 -> 결제 시 품절된 상품은 제외하고 결제할 수 있도록 처리
    private DisplayStatus isVisible;
    public static FindCartProductRes fromEntity(Product product, String thumbnailImage, int quantity) {
        return FindCartProductRes.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .deliveryType(product.getDeliveryType())
                .categoryName(product.getCategory().getName())
                .cost(product.getCost())
                .quantity(quantity)
                .isDiscount(product.getIsDiscount())
                .discountRate(product.getDiscountRate())
                .discountedPrice(product.getDiscountedPrice())
                .thumbnailImage(thumbnailImage)
                .stock(product.getStock())
                .isVisible(product.getIsVisible())
                .build();
    }
}
