package shop.sellution.server.cart.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import shop.sellution.server.auth.dto.CustomUserDetails;
import shop.sellution.server.cart.domain.type.CartType;
import shop.sellution.server.cart.dto.response.FindCartProductRes;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.product.domain.*;

import java.util.*;
import java.util.concurrent.TimeUnit;

import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_CART_ITEM;
import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_USER;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {
    private final RedisTemplate<String, Map<Long, Integer>> cartRedisTemplate;
    private final HashOperations<String, Long, Integer> hashOperations;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private static final String ONETIME_CART_KEY_PREFIX = "cart:onetime:";
    private static final String SUBSCRIPTION_CART_KEY_PREFIX = "cart:subscription:";
    private static final long TTL = 129600; // 3개월

    private CustomUserDetails getCustomUserDetailsFromSecurityContext() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //System.out.println("principal >>>>> " + principal);
        if (principal instanceof CustomUserDetails) {
            return (CustomUserDetails) principal;
        } else {
            throw new AuthException(NOT_FOUND_USER);
        }
    }

    private String getCartKey(CartType cartType){
        CustomUserDetails userDetails = getCustomUserDetailsFromSecurityContext();
        Long customerId = userDetails.getUserId();
//      Long customerId = 35L;
        String keyPrefix = cartType.equals(CartType.ONETIME) ? ONETIME_CART_KEY_PREFIX : SUBSCRIPTION_CART_KEY_PREFIX;
        return keyPrefix + customerId; // cart:onetime:1, cart:subscription:1
    }


    @Override
    public List<FindCartProductRes> findCart(CartType cartType) {
        String cartKey = getCartKey(cartType);
        if (Boolean.FALSE.equals(cartRedisTemplate.hasKey(cartKey))) {
            log.info("장바구니에 담은 물건이 없습니다: {}", cartKey);
            return Collections.emptyList();
        }
        Map<Long, Integer> cartItems = hashOperations.entries(cartKey);
        log.info("Redis key: {}", cartKey);  // 로그 추가
        log.info("Cart items: {}", cartItems);  // 로그 추가
        //이미 단건, 정기 구분된 채로 선택했기 때문에, customerProductRepository 대신 productRepository 사용
        List<Product> products = productRepository.findAllById(cartItems.keySet());
        List<FindCartProductRes> result = products.stream().map(product -> {
            String thumbnailImage = productImageRepository.findByProductProductIdAndPurposeOfUse(product.getProductId(), ProductImageType.THUMBNAIL).stream()
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(null);
            Integer quantity = cartItems.get(product.getProductId());
            return FindCartProductRes.fromEntity(product, thumbnailImage, quantity);
        }).toList();
        return result;
    }

//    @Override
//    public Map<Long, Integer> findCartFromRedis(CartType cartType) {
//        String cartKey = getCartKey(cartType);
//        log.info("Redis key: {}", cartKey);  // 로그 추가
//        log.info("Cart items: {}", hashOperations.entries(cartKey));  // 로그 추가
//        return hashOperations.entries(cartKey);
//    }


    @Override
    public void addToCart(CartType cartType, Long productId, int quantity) {    //장바구니에 있는 상품이면 개수만 증가
        String cartKey = getCartKey(cartType);
        Integer currentQuantity = hashOperations.get(cartKey, productId);
        if (currentQuantity == null) {
            hashOperations.put(cartKey, productId, quantity);
        } else {
            hashOperations.put(cartKey, productId, currentQuantity + quantity);
        }
        log.info("Added to cart: {} - {}: {}", cartKey, productId, quantity);  // 로그 추가
        cartRedisTemplate.expire(cartKey, TTL, TimeUnit.MINUTES);   //TTL 설정
    }

    @Override
    public void removeFromCart(CartType cartType, Long productId) { //장바구니에 없는 상품이면 에러
        String cartKey = getCartKey(cartType);
        hashOperations.delete(cartKey, productId);
        log.info("Removed from cart: {} - {}", cartKey, productId);
//        if (hashOperations.hasKey(cartKey, productId)) {
//            hashOperations.delete(cartKey, productId);
//            log.info("Removed from cart: {} - {}", cartKey, productId);
//        } else {
//            log.error("Product not found in cart: {} - {}", cartKey, productId);
//            throw new BadRequestException(NOT_FOUND_CART_ITEM);
//        }
    }

    @Override
    public void clearCart(CartType cartType) {
        String cartKey = getCartKey(cartType);
        cartRedisTemplate.delete(cartKey);
        log.info("Cleared cart: {}", cartKey);
    }

    @Override
    public void increaseCartItem(CartType cartType, Long productId) { //장바구니에 없는 상품이면 에러가 나야하나? OO
        String cartKey = getCartKey(cartType);
        Integer currentQuantity = hashOperations.get(cartKey, productId);
        if(currentQuantity != null){
            hashOperations.put(cartKey, productId, currentQuantity + 1);
            cartRedisTemplate.expire(cartKey, TTL, TimeUnit.MINUTES);   //TTL 설정
            log.info("Increased cart item: {} - {}", cartKey, productId);
        }else{
            log.error("Cart item not found: {} - {}", cartKey, productId);
            throw new BadRequestException(NOT_FOUND_CART_ITEM);
        }

    }

    @Override
    public void decreaseCartItem(CartType cartType, Long productId) {
        String cartKey = getCartKey(cartType);
        Integer currentQuantity = hashOperations.get(cartKey, productId);
        if(currentQuantity != null && currentQuantity > 1){
            hashOperations.put(cartKey, productId, currentQuantity - 1);
            cartRedisTemplate.expire(cartKey, TTL, TimeUnit.MINUTES);   //TTL 설정
            log.info("Decreased cart item: {} - {}", cartKey, productId);
        }else if(currentQuantity == null){
            log.error("Cart item not found: {} - {}", cartKey, productId);
            throw new BadRequestException(NOT_FOUND_CART_ITEM);
        }

    }
}
