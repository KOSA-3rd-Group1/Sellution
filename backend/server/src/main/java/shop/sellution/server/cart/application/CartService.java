package shop.sellution.server.cart.application;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import shop.sellution.server.cart.dto.CartItem;

import java.util.List;

public interface CartService {

    List<CartItem> findCartItems();

    void addToCart(CartItem cartItem);

    void removeFromCart(Long productId);

    void clearCart();
}
