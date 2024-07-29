package shop.sellution.server.product.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.domain.Product;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class FindAllProductRes {
    private long productId;
    private long code;
    private String name;
    private String categoryName;
    private String productInformation;
    private List<String> detailImages;
    private int cost;
    private DisplayStatus isDiscount;
    private LocalDateTime discountStartDate;
    private LocalDateTime discountEndDate;
    private int discountRate;
    private int discountedPrice;
    private String thumbnailImage;
    private List<String> listImages;
    private DisplayStatus isVisible;
    private DeliveryType deliveryType;
    private int stock;
    private int previousMonthSales;

    public static FindAllProductRes fromEntity(Product product, String thumbnailImage, List<String> listImages, List<String> detailImages) {
        return FindAllProductRes.builder()
                .productId(product.getProductId())
                .code(product.getCode())
                .name(product.getName())
                .categoryName(product.getCategory().getName())  // Assuming getCategory() returns a Category object with a getName() method
                .productInformation(product.getProductInformation())
                .detailImages(detailImages)
                .cost(product.getCost())
                .isDiscount(product.getIsDiscount())
                .discountStartDate(product.getDiscountStartDate())
                .discountEndDate(product.getDiscountEndDate())
                .discountRate(product.getDiscountRate())
                .discountedPrice(product.getDiscountedPrice())
                .thumbnailImage(thumbnailImage)
                .listImages(listImages)
                .isVisible(product.getIsVisible())
                .deliveryType(product.getDeliveryType())
                .stock(product.getStock())
                .previousMonthSales(product.getPreviousMonthSales())
                .build();
    }

}
