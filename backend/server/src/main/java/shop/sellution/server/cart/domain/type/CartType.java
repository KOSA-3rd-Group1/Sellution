package shop.sellution.server.cart.domain.type;

import lombok.Getter;

@Getter
public enum CartType {
    ONETIME("단건배송 상품 장바구니"),
    SUBSCRIPTION("정기배송 상품 장바구니");

    private final String description;

    CartType(String description) {
        this.description = description;
    }
}
