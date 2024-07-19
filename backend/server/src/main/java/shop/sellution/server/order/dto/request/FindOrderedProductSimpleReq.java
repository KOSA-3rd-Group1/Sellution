package shop.sellution.server.order.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FindOrderedProductSimpleReq {
    @NotNull
    private Long productId;

    @NotNull
    @Positive
    private Integer count;

    private Integer discountRate;

    private Integer price;
}
