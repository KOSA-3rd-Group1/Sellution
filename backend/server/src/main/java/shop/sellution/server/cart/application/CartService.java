package shop.sellution.server.cart.application;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import shop.sellution.server.cart.domain.type.CartType;
import shop.sellution.server.cart.dto.response.FindCartProductRes;

import java.util.List;
import java.util.Map;

public interface CartService {

    List<FindCartProductRes> findCart(CartType cartType);

    void addToCart(CartType cartType, Long productId, int quantity);

    void removeFromCart(CartType cartType, Long productId);

    void clearCart(CartType cartType);

    void increaseCartItem(CartType cartType, Long productId);

    void decreaseCartItem(CartType cartType, Long productId);
}
