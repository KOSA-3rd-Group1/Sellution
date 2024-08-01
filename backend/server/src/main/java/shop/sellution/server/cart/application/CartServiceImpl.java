package shop.sellution.server.cart.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import shop.sellution.server.auth.dto.CustomUserDetails;
import shop.sellution.server.cart.dto.CartItem;
import shop.sellution.server.global.exception.AuthException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_USER;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final RedisTemplate<String, List<CartItem>> cartItemRedisTemplate;
    private static final String CART_KEY_PREFIX = "cart:";
    private static final long TTL = 30; // TTL in minutes
    private String getCartKey () {
        CustomUserDetails userDetails = getCustomUserDetailsFromSecurityContext();
        Long customerId = userDetails.getUserId();
        return CART_KEY_PREFIX + customerId;
    }

    @Override
    public List<CartItem> findCartItems() {
        String cartKey = getCartKey(); // cart:1L
        List<CartItem> cartItems = cartItemRedisTemplate.opsForValue().get(cartKey); //해당 key에 해당하는 value를 가져옴
        return cartItems != null ? cartItems : new ArrayList<>();
    }

    @Override
    public void addToCart(CartItem cartItem) {
        String cartKey = getCartKey();

        List<CartItem> cartItems = findCartItems();

        if (cartItems == null) {
            cartItems = new ArrayList<>();
        }
        // 장바구니에 이미 상품이 있는지 확인
        boolean itemExists = false;
        for (CartItem item : cartItems) {
            if (item.getProductId().equals(cartItem.getProductId())) {
                item.setQuantity(item.getQuantity() + cartItem.getQuantity());
                itemExists = true;
                break;
            }
        }

        if (!itemExists) {
            cartItems.add(cartItem);
        }

        cartItemRedisTemplate.opsForValue().set(cartKey, cartItems, TTL, TimeUnit.MINUTES); //기존 키와 값 덮어쓰기
    }

    @Override
    public void removeFromCart(Long productId) {
        String cartKey = getCartKey();
        List<CartItem> cartItems = findCartItems();

        if (cartItems != null) {
            cartItems.removeIf(item -> item.getProductId().equals(productId));
            cartItemRedisTemplate.opsForValue().set(cartKey, cartItems, TTL, TimeUnit.MINUTES);
        }
    }

    @Override
    public void clearCart() {
        String cartKey = getCartKey();
        cartItemRedisTemplate.delete(cartKey);
    }

    private CustomUserDetails getCustomUserDetailsFromSecurityContext() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println("principal >>>>> " + principal);
        if (principal instanceof CustomUserDetails) {
            return (CustomUserDetails) principal;
        } else {
            throw new AuthException(NOT_FOUND_USER);
        }
    }
}
