//package shop.sellution.server.product.presentation;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.mockito.MockitoAnnotations;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.data.domain.PageImpl;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.MediaType;
//import org.springframework.mock.web.MockMultipartFile;
//import org.springframework.restdocs.payload.JsonFieldType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.web.multipart.MultipartFile;
//import shop.sellution.server.common.BaseControllerTest;
//import shop.sellution.server.global.type.DeliveryType;
//import shop.sellution.server.global.type.DisplayStatus;
//import shop.sellution.server.product.application.ProductService;
//import shop.sellution.server.product.dto.request.SaveProductReq;
//import shop.sellution.server.product.dto.response.FindAllProductRes;
//import shop.sellution.server.product.dto.response.FindProductRes;
//
//
//import java.util.List;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.anyLong;
//import static org.mockito.Mockito.*;
//import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
//import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
//import static org.springframework.restdocs.payload.PayloadDocumentation.*;
//import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
//import static org.springframework.restdocs.request.RequestDocumentation.*;
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(ProductController.class)
//class ProductControllerTest extends BaseControllerTest {
//
//    @MockBean
//    private ProductService productService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    private SaveProductReq saveProductReq;
//    private FindAllProductRes findAllProductRes;
//    private FindProductRes findProductRes;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//        saveProductReq = SaveProductReq.builder()
//                .name("Product Name")
//                .categoryName("Category")
//                .productInformation("Product Information")
//                .cost(10000)
//                .isDiscount(DisplayStatus.N)
//                .discountStartDate(null)
//                .discountEndDate(null)
//                .discountRate(0)
//                .thumbnailImage("thumbnail.jpg")
//                .listImages(List.of("list1.jpg", "list2.jpg"))
//                .detailImages(List.of("detail1.jpg", "detail2.jpg"))
//                .isVisible(DisplayStatus.Y)
//                .deliveryType(DeliveryType.SUBSCRIPTION)
//                .stock(100)
//                .companyId(1L)
//                .build();
//
//        findAllProductRes = FindAllProductRes.builder()
//                .code(1L)
//                .name("Product Name")
//                .categoryName("Category")
//                .productInformation("Product Information")
//                .detailImages(List.of("detail1.jpg", "detail2.jpg"))
//                .cost(10000)
//                .isDiscount(DisplayStatus.N)
//                .discountStartDate(null)
//                .discountEndDate(null)
//                .discountRate(0)
//                .discountedPrice(10000)
//                .thumbnailImage("thumbnail.jpg")
//                .listImages(List.of("list1.jpg", "list2.jpg"))
//                .isVisible(DisplayStatus.Y)
//                .deliveryType(DeliveryType.SUBSCRIPTION)
//                .stock(100)
//                .previousMonthSales(10)
//                .build();
//
//        findProductRes = FindProductRes.builder()
//                .productId(1L)
//                .code(1L)
//                .name("Product Name")
//                .thumbnailImage("thumbnail.jpg")
//                .build();
//    }
//
//    @DisplayName("모든 상품을 페이징 처리하여 조회한다.")
//    @Test
//    @WithMockUser
//    void getAllProducts_Success() throws Exception {
//        Pageable pageable = PageRequest.of(0, 10);
//        when(productService.getAllProducts(pageable)).thenReturn(new PageImpl<>(List.of(findProductRes), pageable, 1));
//
//        mockMvc.perform(get("/products")
//                        .param("page", "0")
//                        .param("size", "10"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.content[0].name").value("Product Name"))
//                .andDo(document("Product/findAllProducts",
//                        preprocessRequest(prettyPrint()),
//                        preprocessResponse(prettyPrint()),
//                        queryParameters(
//                                parameterWithName("page").description("페이지 번호 (0부터 시작)").optional(),
//                                parameterWithName("size").description("페이지 크기").optional()
//                        ),
//                        responseFields(
//                                fieldWithPath("content").type(JsonFieldType.ARRAY).description("상품 목록"),
//                                fieldWithPath("content[].productId").type(JsonFieldType.NUMBER).description("상품 ID"),
//                                fieldWithPath("content[].code").type(JsonFieldType.NUMBER).description("상품 코드"),
//                                fieldWithPath("content[].name").type(JsonFieldType.STRING).description("상품 이름"),
//                                fieldWithPath("content[].thumbnailImage").type(JsonFieldType.STRING).description("썸네일 이미지"),
//                                fieldWithPath("content[].categoryName").type(JsonFieldType.STRING).description("카테고리 이름").optional(),
//                                fieldWithPath("content[].isVisible").type(JsonFieldType.STRING).description("노출 여부").optional(),
//                                fieldWithPath("content[].cost").type(JsonFieldType.NUMBER).description("가격").optional(),
//                                fieldWithPath("content[].stock").type(JsonFieldType.NUMBER).description("재고").optional(),
//                                fieldWithPath("content[].deliveryType").type(JsonFieldType.STRING).description("배송 타입").optional(),
//                                fieldWithPath("content[].previousMonthSales").type(JsonFieldType.NUMBER).description("이전 달 판매량").optional(),
//                                fieldWithPath("content[].isDiscount").type(JsonFieldType.STRING).description("할인 여부").optional(),
//                                fieldWithPath("content[].discountRate").type(JsonFieldType.NUMBER).description("할인율").optional(),
//                                fieldWithPath("content[].discountedPrice").type(JsonFieldType.NUMBER).description("할인된 가격").optional(),
//                                fieldWithPath("pageable").type(JsonFieldType.OBJECT).description("페이지 정보"),
//                                fieldWithPath("pageable.sort").type(JsonFieldType.OBJECT).description("정렬 정보"),
//                                fieldWithPath("pageable.sort.empty").type(JsonFieldType.BOOLEAN).description("정렬 정보가 비어있는지 여부"),
//                                fieldWithPath("pageable.sort.sorted").type(JsonFieldType.BOOLEAN).description("정렬되었는지 여부"),
//                                fieldWithPath("pageable.sort.unsorted").type(JsonFieldType.BOOLEAN).description("정렬되지 않았는지 여부"),
//                                fieldWithPath("pageable.pageNumber").type(JsonFieldType.NUMBER).description("페이지 번호"),
//                                fieldWithPath("pageable.pageSize").type(JsonFieldType.NUMBER).description("페이지 크기"),
//                                fieldWithPath("pageable.offset").type(JsonFieldType.NUMBER).description("오프셋"),
//                                fieldWithPath("pageable.paged").type(JsonFieldType.BOOLEAN).description("페이지된 여부"),
//                                fieldWithPath("pageable.unpaged").type(JsonFieldType.BOOLEAN).description("페이지되지 않은 여부"),
//                                fieldWithPath("totalPages").type(JsonFieldType.NUMBER).description("전체 페이지 수"),
//                                fieldWithPath("totalElements").type(JsonFieldType.NUMBER).description("전체 요소 수"),
//                                fieldWithPath("last").type(JsonFieldType.BOOLEAN).description("마지막 페이지 여부"),
//                                fieldWithPath("size").type(JsonFieldType.NUMBER).description("페이지 크기"),
//                                fieldWithPath("number").type(JsonFieldType.NUMBER).description("현재 페이지 번호"),
//                                fieldWithPath("sort").type(JsonFieldType.OBJECT).description("정렬 정보"),
//                                fieldWithPath("sort.empty").type(JsonFieldType.BOOLEAN).description("정렬 정보가 비어있는지 여부"),
//                                fieldWithPath("sort.sorted").type(JsonFieldType.BOOLEAN).description("정렬되었는지 여부"),
//                                fieldWithPath("sort.unsorted").type(JsonFieldType.BOOLEAN).description("정렬되지 않았는지 여부"),
//                                fieldWithPath("numberOfElements").type(JsonFieldType.NUMBER).description("현재 페이지의 요소 수"),
//                                fieldWithPath("first").type(JsonFieldType.BOOLEAN).description("첫 페이지 여부"),
//                                fieldWithPath("empty").type(JsonFieldType.BOOLEAN).description("결과가 비어있는지 여부")
//                        )
//                ));
//
//        verify(productService, times(1)).getAllProducts(pageable);
//    }
//
//
//    @DisplayName("상품 ID로 상품을 조회한다.")
//    @Test
//    @WithMockUser
//    void getProductById_Success() throws Exception {
//        when(productService.getProductById(anyLong())).thenReturn(findAllProductRes);
//
//        mockMvc.perform(get("/products/{productId}", 1L))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.name").value("Product Name"))
//                .andDo(document("Product/findProductById",
//                        pathParameters(
//                                parameterWithName("productId").description("상품 ID")
//                        ),
//                        responseFields(
//                                fieldWithPath("code").type(JsonFieldType.NUMBER).description("상품 코드"),
//                                fieldWithPath("name").type(JsonFieldType.STRING).description("상품 이름"),
//                                fieldWithPath("categoryName").type(JsonFieldType.STRING).description("카테고리 이름"),
//                                fieldWithPath("productInformation").type(JsonFieldType.STRING).description("상품 정보"),
//                                fieldWithPath("detailImages").type(JsonFieldType.ARRAY).description("상세 이미지"),
//                                fieldWithPath("cost").type(JsonFieldType.NUMBER).description("가격"),
//                                fieldWithPath("isDiscount").type(JsonFieldType.STRING).description("할인 여부"),
//                                fieldWithPath("discountStartDate").type(JsonFieldType.STRING).description("할인 시작일").optional(),
//                                fieldWithPath("discountEndDate").type(JsonFieldType.STRING).description("할인 종료일").optional(),
//                                fieldWithPath("discountRate").type(JsonFieldType.NUMBER).description("할인율"),
//                                fieldWithPath("discountedPrice").type(JsonFieldType.NUMBER).description("할인된 가격"),
//                                fieldWithPath("thumbnailImage").type(JsonFieldType.STRING).description("썸네일 이미지"),
//                                fieldWithPath("listImages").type(JsonFieldType.ARRAY).description("리스트 이미지"),
//                                fieldWithPath("isVisible").type(JsonFieldType.STRING).description("노출 여부"),
//                                fieldWithPath("deliveryType").type(JsonFieldType.STRING).description("배송 타입"),
//                                fieldWithPath("stock").type(JsonFieldType.NUMBER).description("재고"),
//                                fieldWithPath("previousMonthSales").type(JsonFieldType.NUMBER).description("이전 달 판매량")
//                        )
//                ));
//
//        verify(productService, times(1)).getProductById(anyLong());
//    }
//
//    @DisplayName("상품을 생성한다.")
//    @Test
//    @WithMockUser
//    void createProduct_Success() throws Exception {
//        MockMultipartFile productReqFile = new MockMultipartFile("product", "product.json", "application/json", objectMapper.writeValueAsBytes(saveProductReq));
//        MockMultipartFile thumbnailFile = new MockMultipartFile("thumbnailImage", "thumbnail.jpg", "image/jpeg", "image content".getBytes());
//        MockMultipartFile listImage1 = new MockMultipartFile("listImages", "list1.jpg", "image/jpeg", "image content".getBytes());
//        MockMultipartFile listImage2 = new MockMultipartFile("listImages", "list2.jpg", "image/jpeg", "image content".getBytes());
//        MockMultipartFile detailImage1 = new MockMultipartFile("detailImages", "detail1.jpg", "image/jpeg", "image content".getBytes());
//        MockMultipartFile detailImage2 = new MockMultipartFile("detailImages", "detail2.jpg", "image/jpeg", "image content".getBytes());
//
//        doNothing().when(productService).createProduct(any(SaveProductReq.class), any(MultipartFile.class), anyList(), anyList());
//
//        mockMvc.perform(multipart("/products")
//                        .file(productReqFile)
//                        .file(thumbnailFile)
//                        .file(listImage1)
//                        .file(listImage2)
//                        .file(detailImage1)
//                        .file(detailImage2)
//                        .with(csrf())
//                        .contentType(MediaType.MULTIPART_FORM_DATA))
//                .andExpect(status().isNoContent())
//                .andDo(document("Product/createProduct",
//                        preprocessRequest(prettyPrint()),
//                        preprocessResponse(prettyPrint()),
//                        requestParts(
//                                partWithName("product").description("상품 정보"),
//                                partWithName("thumbnailImage").description("썸네일 이미지 파일").optional(),
//                                partWithName("listImages").description("리스트 이미지 파일들").optional(),
//                                partWithName("detailImages").description("상세 이미지 파일들").optional()
//                        ),
//                        requestPartFields("product",
//                                fieldWithPath("name").type(JsonFieldType.STRING).description("상품 이름"),
//                                fieldWithPath("categoryName").type(JsonFieldType.STRING).description("카테고리 이름"),
//                                fieldWithPath("productInformation").type(JsonFieldType.STRING).description("상품 정보"),
//                                fieldWithPath("cost").type(JsonFieldType.NUMBER).description("가격"),
//                                fieldWithPath("isDiscount").type(JsonFieldType.STRING).description("할인 여부"),
//                                fieldWithPath("discountStartDate").type(JsonFieldType.STRING).description("할인 시작일").optional(),
//                                fieldWithPath("discountEndDate").type(JsonFieldType.STRING).description("할인 종료일").optional(),
//                                fieldWithPath("discountRate").type(JsonFieldType.NUMBER).description("할인율"),
//                                fieldWithPath("isVisible").type(JsonFieldType.STRING).description("노출 여부"),
//                                fieldWithPath("deliveryType").type(JsonFieldType.STRING).description("배송 타입"),
//                                fieldWithPath("stock").type(JsonFieldType.NUMBER).description("재고"),
//                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
//                                fieldWithPath("thumbnailImage").type(JsonFieldType.STRING).description("썸네일 이미지"),
//                                fieldWithPath("listImages").type(JsonFieldType.ARRAY).description("리스트 이미지 파일들"),
//                                fieldWithPath("detailImages").type(JsonFieldType.ARRAY).description("상세 이미지 파일들")
//                        )
//                ));
//
//        verify(productService, times(1)).createProduct(any(SaveProductReq.class), any(MultipartFile.class), anyList(), anyList());
//    }
//
//
//    @DisplayName("상품을 수정한다.")
//    @Test
//    @WithMockUser
//    void updateProduct_Success() throws Exception {
//        MockMultipartFile productReqFile = new MockMultipartFile("product", "", "application/json", objectMapper.writeValueAsBytes(saveProductReq));
//        MockMultipartFile thumbnailFile = new MockMultipartFile("thumbnailImage", "thumbnail.jpg", "image/jpeg", "image content".getBytes());
//        MockMultipartFile listImage1 = new MockMultipartFile("listImages", "list1.jpg", "image/jpeg", "image content".getBytes());
//        MockMultipartFile listImage2 = new MockMultipartFile("listImages", "list2.jpg", "image/jpeg", "image content".getBytes());
//        MockMultipartFile detailImage1 = new MockMultipartFile("detailImages", "detail1.jpg", "image/jpeg", "image content".getBytes());
//        MockMultipartFile detailImage2 = new MockMultipartFile("detailImages", "detail2.jpg", "image/jpeg", "image content".getBytes());
//
//        doNothing().when(productService).updateProduct(anyLong(), any(SaveProductReq.class), any(MultipartFile.class), anyList(), anyList());
//
//        mockMvc.perform(multipart("/products/{productId}", 1L)
//                        .file(productReqFile)
//                        .file(thumbnailFile)
//                        .file(listImage1)
//                        .file(listImage2)
//                        .file(detailImage1)
//                        .file(detailImage2)
//                        .with(request -> {
//                            request.setMethod("PUT");
//                            return request;
//                        })
//                        .with(csrf()))
//                .andExpect(status().isNoContent())
//                .andDo(document("Product/updateProduct",
//                        preprocessRequest(prettyPrint()),
//                        preprocessResponse(prettyPrint()),
//                        pathParameters(
//                                parameterWithName("productId").description("상품 ID")
//                        ),
//                        requestParts(
//                                partWithName("product").description("상품 정보"),
//                                partWithName("thumbnailImage").description("썸네일 이미지 파일").optional(),
//                                partWithName("listImages").description("리스트 이미지 파일들").optional(),
//                                partWithName("detailImages").description("상세 이미지 파일들").optional()
//                        ),
//                        requestPartFields("product",
//                                fieldWithPath("name").type(JsonFieldType.STRING).description("상품 이름"),
//                                fieldWithPath("categoryName").type(JsonFieldType.STRING).description("카테고리 이름"),
//                                fieldWithPath("productInformation").type(JsonFieldType.STRING).description("상품 정보"),
//                                fieldWithPath("cost").type(JsonFieldType.NUMBER).description("가격"),
//                                fieldWithPath("isDiscount").type(JsonFieldType.STRING).description("할인 여부"),
//                                fieldWithPath("discountStartDate").type(JsonFieldType.STRING).description("할인 시작일").optional(),
//                                fieldWithPath("discountEndDate").type(JsonFieldType.STRING).description("할인 종료일").optional(),
//                                fieldWithPath("discountRate").type(JsonFieldType.NUMBER).description("할인율"),
//                                fieldWithPath("isVisible").type(JsonFieldType.STRING).description("노출 여부"),
//                                fieldWithPath("deliveryType").type(JsonFieldType.STRING).description("배송 타입"),
//                                fieldWithPath("stock").type(JsonFieldType.NUMBER).description("재고"),
//                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
//                                fieldWithPath("thumbnailImage").type(JsonFieldType.STRING).description("썸네일 이미지").optional(),
//                                fieldWithPath("listImages").type(JsonFieldType.ARRAY).description("리스트 이미지들").optional(),
//                                fieldWithPath("detailImages").type(JsonFieldType.ARRAY).description("상세 이미지들").optional()
//                        )
//                ));
//
//        verify(productService, times(1)).updateProduct(anyLong(), any(SaveProductReq.class), any(MultipartFile.class), anyList(), anyList());
//    }
//
//    @DisplayName("상품을 삭제한다.")
//    @Test
//    @WithMockUser
//    void deleteProduct_Success() throws Exception {
//        doNothing().when(productService).deleteProduct(anyLong());
//
//        mockMvc.perform(delete("/products/{productId}", 1L)
//                        .with(csrf()))
//                .andExpect(status().isNoContent())
//                .andDo(document("Product/deleteProduct",
//                        preprocessRequest(prettyPrint()),
//                        preprocessResponse(prettyPrint()),
//                        pathParameters(
//                                parameterWithName("productId").description("상품 ID")
//                        )
//                ));
//
//        verify(productService, times(1)).deleteProduct(anyLong());
//    }
//}
