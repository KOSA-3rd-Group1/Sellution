package shop.sellution.server.category.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;

public interface CategoryRepositoryCustom {
    Page<Category> findByIsVisibleAndDeliveryType(DisplayStatus isVisible, DeliveryType deliveryType, Pageable pageable);
}
