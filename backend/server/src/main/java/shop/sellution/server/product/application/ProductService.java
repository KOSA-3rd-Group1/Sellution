package shop.sellution.server.product.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import shop.sellution.server.product.dto.request.SaveProductReq;
import shop.sellution.server.product.dto.response.FindAllProductRes;
import shop.sellution.server.product.dto.response.FindProductRes;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    Page<FindProductRes> getAllProducts(Pageable pageable);
    FindAllProductRes getProductById(Long productId);
    void createProduct(SaveProductReq productRequestDTO, MultipartFile thumbnailImage, List<MultipartFile> listImages, List<MultipartFile> detailImages) throws IOException;
    void updateProduct(Long productId, SaveProductReq productRequestDTO, MultipartFile thumbnailImage, List<MultipartFile> listImages, List<MultipartFile> detailImages) throws IOException;

    //    void createProduct(SaveProductReq productRequestDTO);
//    void updateProduct(Long productId, SaveProductReq productRequestDTO);
    void deleteProduct(Long productId);
    void deleteProducts(List<Long> ids);
}
