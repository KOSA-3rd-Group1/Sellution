package shop.sellution.server.cart.presentation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.cart.application.CartService;
import shop.sellution.server.cart.domain.type.CartType;
import shop.sellution.server.cart.dto.response.FindCartProductRes;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    // 장바구니 목록 조회
    @GetMapping("/{cartType}")
    public ResponseEntity<List<FindCartProductRes>> findCart(@PathVariable CartType cartType) {
        List<FindCartProductRes> cartItems = cartService.findCart(cartType);
        return ResponseEntity.ok(cartItems);
    }

    //redis에서 장바구니 목록 조회
//    @GetMapping("/redis/{cartType}/length")
//    public ResponseEntity<Integer> getCartLength(@PathVariable CartType cartType) {
//        int cartLength = cartService.getCartLength(cartType);
//        return ResponseEntity.ok(cartLength);
//    }

    // 장바구니에 상품 추가
    @PostMapping("/add/{cartType}")
    public ResponseEntity<String> addToCart(@PathVariable CartType cartType, @RequestParam Long productId, @RequestParam int quantity) {
        cartService.addToCart(cartType, productId, quantity);
        return ResponseEntity.ok("success");
    }

    // 장바구니에서 상품 제거
    @DeleteMapping("/remove/{cartType}/{productId}")
    public ResponseEntity<String> removeFromCart(@PathVariable CartType cartType, @PathVariable Long productId) {
        cartService.removeFromCart(cartType, productId);
        return ResponseEntity.ok("success");
    }

    // 장바구니 전체 삭제
    @PostMapping("/clear/{cartType}")
    public ResponseEntity<String> clearCart(@PathVariable CartType cartType) {
        cartService.clearCart(cartType);
        return ResponseEntity.ok("success");
    }

    // 장바구니 상품 수량 증가
    @PostMapping("/increase/{cartType}/{productId}")
    public ResponseEntity<String> increaseCartItem(@PathVariable CartType cartType, @PathVariable Long productId) {
        cartService.increaseCartItem(cartType, productId);
        return ResponseEntity.ok("success");
    }

    // 장바구니 상품 수량 감소
    @PostMapping("/decrease/{cartType}/{productId}")
    public ResponseEntity<String> decreaseCartItem(@PathVariable CartType cartType, @PathVariable Long productId) {
        cartService.decreaseCartItem(cartType, productId);
        return ResponseEntity.ok("success");
    }
}
