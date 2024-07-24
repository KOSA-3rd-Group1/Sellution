package shop.sellution.server.order.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import shop.sellution.server.order.domain.type.OrderType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class SaveOrderReq {

    @NotNull(message = "회사 아이디는 필수입니다.")
    private Long companyId;

    @NotNull(message = "주소 아이디는 필수입니다.")
    private Long addressId;

    @NotNull(message = "주문자 아이디는 필수입니다.")
    private Long accountId;

    private Long eventId;

    @Nullable
    private Long monthOptionId;
    @Nullable
    private Long weekOptionId;

    @NotNull(message = "주문 타입은 필수입니다.")
    private OrderType orderType;

    @Nullable
    private Integer totalDeliveryCount;

    @NotNull
    private LocalDate deliveryStartDate; // 단건주문은 주문날짜 + 3일로 전달받는다.

    @NotNull
    @Size(min =1 ,message = "주문한 상품이 존재해야합니다.")
    private List<FindOrderedProductSimpleReq> orderedProducts;

    @Nullable
    private List<Long> dayOptionIds;

}
