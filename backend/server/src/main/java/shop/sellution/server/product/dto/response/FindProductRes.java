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
public class FindProductRes {
    private Long productId;
    private long code;
    private String thumbnailImage;
    private String name;
    private String categoryName;
    private DisplayStatus isVisible;
    private int cost;
    private int stock;
    private DeliveryType deliveryType;
    private int previousMonthSales;
    private DisplayStatus isDiscount;
    private int discountRate;
    private int discountedPrice;



    public static FindProductRes fromEntity(Product product, String thumbnailImage) {
        return FindProductRes.builder()
                .productId(product.getProductId())
                .code(product.getCode())
                .thumbnailImage(thumbnailImage)
                .name(product.getName())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : "카테고리없음")
                .isVisible(product.getIsVisible())
                .cost(product.getCost())
                .stock(product.getStock())
                .deliveryType(product.getDeliveryType())
                .isDiscount(product.getIsDiscount())
                .discountRate(product.getDiscountRate())
                .discountedPrice(product.getDiscountedPrice())
                .build();
    }
}
