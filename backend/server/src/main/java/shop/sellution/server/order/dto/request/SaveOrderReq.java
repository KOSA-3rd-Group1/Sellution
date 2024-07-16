package shop.sellution.server.order.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import shop.sellution.server.order.domain.type.OrderType;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class SaveOrderReq {

    @NotNull
    private Long companyId;

    @NotNull
    private Long customerId;

    @NotNull
    private Long addressId;

    @Nullable
    private Long monthOptionId;
    @Nullable
    private Long weekOptionId;

    @NotNull
    private OrderType orderType;

    @Nullable
    private Integer totalDeliveryCount;

    @NotNull
    private LocalDateTime deliveryStartDate;

    @NotNull
    @Size(min =1 ,message = "주문한 상품이 존재해야합니다.")
    private List<OrderedProduct> orderedProducts;


    static class OrderedProduct {
        @NotNull
        private Long productId;

        @NotNull
        @Positive
        private Integer count;

        private Integer discountRate;

        private Integer price;
    }

}
