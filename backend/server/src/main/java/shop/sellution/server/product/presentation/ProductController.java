package shop.sellution.server.product.presentation;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.product.application.ProductService;
import shop.sellution.server.product.dto.response.FindAllProductRes;
import shop.sellution.server.product.dto.response.FindProductRes;
import shop.sellution.server.product.dto.request.SaveProductReq;


@RestController
@RequestMapping("/products")
public class ProductController {

//    private static final Logger log = LoggerFactory.getLogger(ClientProductController.class);
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<Page<FindProductRes>> getAllProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<FindAllProductRes> getProductById(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.getProductById(productId));
    }

    @PostMapping
    public ResponseEntity<Void> createProduct(@Valid @RequestBody SaveProductReq saveProductReq) {
        productService.createProduct(saveProductReq);
        // 로그로 데이터 확인
        //log.info("Received Product Data: {}", productRequestDTO);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Void> updateProduct(@PathVariable Long productId, @Valid @RequestBody SaveProductReq saveProductReq) {
        productService.updateProduct(productId, saveProductReq);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

}
