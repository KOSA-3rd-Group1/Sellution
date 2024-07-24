package shop.sellution.server.product.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.product.dto.response.FindCustomerProductRes;

import java.util.List;

public interface CustomerProductService {
    Page<FindCustomerProductRes> findAllProducts(Long companyId, DeliveryType deliveryType, Long categoryId, Pageable pageable);
}
