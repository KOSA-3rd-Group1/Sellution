package shop.sellution.server.product.application;

import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.product.dto.response.FindCustomerProductRes;

import java.util.List;

public interface CustomerProductService {
    List<FindCustomerProductRes> findAllProducts(String ShopUrl, DeliveryType deliveryType, Long categoryId);
}
