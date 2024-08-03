package shop.sellution.server.product.presentation;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import shop.sellution.server.product.application.ProductService;
import shop.sellution.server.product.dto.response.FindAllProductRes;
import shop.sellution.server.product.dto.response.FindProductRes;
import shop.sellution.server.product.dto.request.SaveProductReq;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/products")
public class ProductController {

    //    private static final Logger log = LoggerFactory.getLogger(ClientProductController.class);
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<Page<FindProductRes>> getAllProducts(
            @RequestParam Long companyId,
            Pageable pageable ,
            @RequestParam(required = false) String deliveryType,
            @RequestParam(required = false) String isDiscount,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) String isVisible,
            @RequestParam(required = false) String productName) {
        return ResponseEntity.ok(productService.getAllProducts(companyId, pageable, deliveryType, isDiscount, categoryName, isVisible, productName));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<FindAllProductRes> getProductById(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.getProductById(productId));
    }

    @PostMapping
    public ResponseEntity<Void> createProduct(@Valid @RequestPart("product") SaveProductReq saveProductReq,
                                              @RequestPart(value = "thumbnailImage", required = false) MultipartFile thumbnailImage,
                                              @RequestPart(value = "listImages", required = false) List<MultipartFile> listImages,
                                              @RequestPart(value = "detailImages", required = false) List<MultipartFile> detailImages) {
        try {
            productService.createProduct(saveProductReq, thumbnailImage, listImages, detailImages);
            return ResponseEntity.noContent().build();

        } catch (IOException e) {
            // 로그로 데이터 확인
            //log.info("Received Product Data: {}", productRequestDTO);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Void> updateProduct(@PathVariable Long productId,
                                              @Valid @RequestPart("product") SaveProductReq saveProductReq,
                                              @RequestPart(value = "thumbnailImage", required = false) MultipartFile thumbnailImage,
                                              @RequestPart(value = "listImages", required = false) List<MultipartFile> listImages,
                                              @RequestPart(value = "detailImages", required = false) List<MultipartFile> detailImages) {
        try {
            productService.updateProduct(productId, saveProductReq, thumbnailImage, listImages, detailImages);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            // 로그 기록
            // e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }


    @DeleteMapping
    public ResponseEntity<Void> deleteProducts(@RequestBody List<Long> ids) {
        productService.deleteProducts(ids);
        return ResponseEntity.noContent().build();
    }

}