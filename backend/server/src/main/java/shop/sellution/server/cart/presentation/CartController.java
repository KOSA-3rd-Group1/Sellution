package shop.sellution.server.cart.presentation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.cart.application.CartService;
import shop.sellution.server.cart.dto.CartItem;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    // 장바구니 목록 조회
    @GetMapping("/{cartType}")
    public ResponseEntity<List<CartItem>> findCartItems(@PathVariable String cartType) {
        List<CartItem> cartItems = cartService.findCartItems(cartType);
        return ResponseEntity.ok(cartItems);
    }

    // 장바구니에 상품 추가
    @PostMapping("/add/{cartType}")
    public ResponseEntity<String> addToCart(@PathVariable String CartType, @RequestBody CartItem cartItem) {
        cartService.addToCart(cartItem);
        return ResponseEntity.ok("success");
    }

    // 장바구니에서 상품 제거
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Long productId) {
        cartService.removeFromCart(productId);
        return ResponseEntity.ok("success");
    }

    // 장바구니 전체 삭제
    @PostMapping("/clear")
    public ResponseEntity<String> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok("success");
    }
}
