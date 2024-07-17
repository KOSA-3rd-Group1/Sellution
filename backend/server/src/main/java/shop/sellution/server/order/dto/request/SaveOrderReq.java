package shop.sellution.server.order.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
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
    private Long addressId;

    @NotNull
    private Long accountId;

    @Nullable
    private Long monthOptionId;
    @Nullable
    private Long weekOptionId;

    @NotNull
    private OrderType orderType;

    @Nullable
    private Integer totalDeliveryCount;

    @NotNull
    private LocalDateTime deliveryStartDate; // 단건주문은 주문날짜 + 3일로 전달받는다.

    @NotNull
    @Size(min =1 ,message = "주문한 상품이 존재해야합니다.")
    private List<FindOrderedProductSimpleReq> orderedProducts;

    @Nullable
    private List<Long> dayOptionIds;

}
