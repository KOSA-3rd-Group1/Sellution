package shop.sellution.server.cart.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class CartItem implements Serializable { //직렬화 가능한 객체로 만들기 위해
    private Long productId;
    private int quantity;
}
