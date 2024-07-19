package shop.sellution.server.order.dto.response;

import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.order.domain.OrderedProduct;

@Getter
@Builder
public class FindOrderedProductRes {

    private Long productId;
    private String productName;
    private int count;
    private int discountRate;
    private int price;

    public static FindOrderedProductRes fromEntity(OrderedProduct orderedProduct) {
        return FindOrderedProductRes.builder()
                .productId(orderedProduct.getProduct().getProductId())
                .productName(orderedProduct.getProduct().getName())
                .count(orderedProduct.getCount())
                .discountRate(orderedProduct.getDiscountRate())
                .price(orderedProduct.getPrice())
                .build();
    }
}
