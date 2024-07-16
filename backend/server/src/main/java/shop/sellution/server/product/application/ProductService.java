package shop.sellution.server.product.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.product.dto.request.SaveProductReq;
import shop.sellution.server.product.dto.response.FindAllProductRes;
import shop.sellution.server.product.dto.response.FindProductRes;

public interface ProductService {
    Page<FindProductRes> getAllProducts(Pageable pageable);
    FindAllProductRes getProductById(Long productId);
    void createProduct(SaveProductReq productRequestDTO);
    void updateProduct(Long productId, SaveProductReq productRequestDTO);
    void deleteProduct(Long productId);
}
