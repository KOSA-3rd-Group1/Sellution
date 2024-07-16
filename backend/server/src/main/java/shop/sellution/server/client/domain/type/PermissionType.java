package shop.sellution.server.client.domain.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PermissionType {

    CUSTOMER_MANAGEMENT(1),     // (이진수: 000001) - 회원 관리 허가
    PRODUCT_MANAGEMENT(1 << 1), // (이진수: 000010) - 상품 관리 허가
    ORDER_MANAGEMENT(1 << 2),   // (이진수: 000100) - 주문 관리 허가
    PAYMENT_MANAGEMENT(1 << 3), // (이진수: 001000) - 결제 내역 관리 허가
    EVENT_MANAGEMENT(1 << 4),   // (이진수: 010000) - 이벤트 관리 허가
    SHOP_MANAGEMENT(1 << 5);    // (이진수: 100000) - 쇼핑몰 관리 허가

    private final int bit;
}
