package shop.sellution.server.product.presentation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.restdocs.payload.PayloadDocumentation;
import org.springframework.restdocs.request.RequestDocumentation;
import org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.application.CustomerProductService;
import shop.sellution.server.product.dto.response.FindCustomerProductRes;
import shop.sellution.server.common.BaseControllerTest;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CustomerProductController.class)
class CustomerProductControllerTest extends BaseControllerTest {
    @MockBean
    private CustomerProductService customerProductService;

    @DisplayName("사업체 ID로 상품 조회 성공")
    @Test
    void findAllCustomerProducts_Success() throws Exception {
        // given
        Long companyId = 1L;
        DeliveryType deliveryType = DeliveryType.ONETIME;
        PageRequest pageable = PageRequest.of(0, 10);
        List<FindCustomerProductRes> products = List.of(
                FindCustomerProductRes.builder()
                        .productId(1L)
                        .name("product1")
                        .categoryName("category1")
                        .deliveryType(DeliveryType.ONETIME)
                        .cost(1000)
                        .isDiscount(DisplayStatus.N)
                        .discountRate(0)
                        .discountedPrice(1000)
                        .thumbnailImage("thumbnail1")
                        .stock(100)
                        .build(),
                FindCustomerProductRes.builder()
                        .productId(2L)
                        .name("product2")
                        .categoryName("category2")
                        .deliveryType(DeliveryType.ONETIME)
                        .cost(2000)
                        .isDiscount(DisplayStatus.Y)
                        .discountRate(10)
                        .discountedPrice(1800)
                        .thumbnailImage("thumbnail2")
                        .stock(200)
                        .build()
        );
        Page<FindCustomerProductRes> productPage = new PageImpl<>(products, pageable, products.size());

        // 모킹된 service가 호출될 때 Page<FindCustomerProductRes>을 반환
        when(customerProductService.findAllProducts(companyId, deliveryType, null, pageable)).thenReturn(productPage);

        // when & then
        mockMvc.perform(RestDocumentationRequestBuilders.get("/products/company/{companyId}", companyId)
                        .param("deliveryType", deliveryType.name())
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].productId").value(1L))
                .andExpect(jsonPath("$.content[0].name").value("product1"))
                .andExpect(jsonPath("$.content[0].categoryName").value("category1"))
                .andExpect(jsonPath("$.content[0].cost").value(1000))
                .andExpect(jsonPath("$.content[0].isDiscount").value("N"))
                .andExpect(jsonPath("$.content[0].discountRate").value(0))
                .andExpect(jsonPath("$.content[0].discountedPrice").value(1000))
                .andExpect(jsonPath("$.content[0].thumbnailImage").value("thumbnail1"))
                .andExpect(jsonPath("$.content[0].stock").value(100))
                .andExpect(jsonPath("$.content[1].productId").value(2L))
                .andExpect(jsonPath("$.content[1].name").value("product2"))
                .andExpect(jsonPath("$.content[1].categoryName").value("category2"))
                .andExpect(jsonPath("$.content[1].cost").value(2000))
                .andExpect(jsonPath("$.content[1].isDiscount").value("Y"))
                .andExpect(jsonPath("$.content[1].discountRate").value(10))
                .andExpect(jsonPath("$.content[1].discountedPrice").value(1800))
                .andExpect(jsonPath("$.content[1].thumbnailImage").value("thumbnail2"))
                .andExpect(jsonPath("$.content[1].stock").value(200))
                .andDo(document("Product/findAllCustomerProducts",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("companyId").description("사업체 ID")
                        ),
                        queryParameters(
                                parameterWithName("deliveryType").description("배달 유형"),
                                parameterWithName("page").description("페이지 번호"),
                                parameterWithName("size").description("페이지 크기")
                        ),
                        PayloadDocumentation.responseFields(
                                PayloadDocumentation.fieldWithPath("content[].productId").type(JsonFieldType.NUMBER).description("상품 ID"),
                                PayloadDocumentation.fieldWithPath("content[].name").type(JsonFieldType.STRING).description("상품 이름"),
                                PayloadDocumentation.fieldWithPath("content[].categoryName").type(JsonFieldType.STRING).description("카테고리 이름"),
                                PayloadDocumentation.fieldWithPath("content[].deliveryType").type(JsonFieldType.STRING).description("배송 타입"),
                                PayloadDocumentation.fieldWithPath("content[].cost").type(JsonFieldType.NUMBER).description("가격"),
                                PayloadDocumentation.fieldWithPath("content[].isDiscount").type(JsonFieldType.STRING).description("할인 여부"),
                                PayloadDocumentation.fieldWithPath("content[].discountRate").type(JsonFieldType.NUMBER).description("할인율"),
                                PayloadDocumentation.fieldWithPath("content[].discountedPrice").type(JsonFieldType.NUMBER).description("할인된 가격"),
                                PayloadDocumentation.fieldWithPath("content[].thumbnailImage").type(JsonFieldType.STRING).description("썸네일 이미지 URL"),
                                PayloadDocumentation.fieldWithPath("content[].stock").type(JsonFieldType.NUMBER).description("재고"),
                                PayloadDocumentation.fieldWithPath("pageable").ignored(),
                                PayloadDocumentation.fieldWithPath("totalPages").ignored(),
                                PayloadDocumentation.fieldWithPath("totalElements").ignored(),
                                PayloadDocumentation.fieldWithPath("last").ignored(),
                                PayloadDocumentation.fieldWithPath("numberOfElements").ignored(),
                                PayloadDocumentation.fieldWithPath("first").ignored(),
                                PayloadDocumentation.fieldWithPath("size").ignored(),
                                PayloadDocumentation.fieldWithPath("number").ignored(),
                                PayloadDocumentation.fieldWithPath("empty").ignored(),
                                PayloadDocumentation.fieldWithPath("sort.empty").ignored(),
                                PayloadDocumentation.fieldWithPath("sort.sorted").ignored(),
                                PayloadDocumentation.fieldWithPath("sort.unsorted").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.pageNumber").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.pageSize").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.sort.empty").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.sort.sorted").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.sort.unsorted").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.offset").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.paged").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.unpaged").ignored()
                        )
                ));
    }

    @DisplayName("사업체 ID와 카테고리 필터링으로 상품 조회 성공")
    @Test
    void findAllCustomerProducts_WithCategory() throws Exception {
        // given
        Long companyId = 1L;
        DeliveryType deliveryType = DeliveryType.ONETIME;
        Long categoryId = 2L;
        PageRequest pageable = PageRequest.of(0, 10);
        List<FindCustomerProductRes> products = List.of(
                FindCustomerProductRes.builder()
                        .productId(1L)
                        .name("product1")
                        .categoryName("category1")
                        .deliveryType(DeliveryType.ONETIME)
                        .cost(1000)
                        .isDiscount(DisplayStatus.N)
                        .discountRate(0)
                        .discountedPrice(1000)
                        .thumbnailImage("thumbnail1")
                        .stock(100)
                        .build(),
                FindCustomerProductRes.builder()
                        .productId(2L)
                        .name("product2")
                        .categoryName("category2")
                        .deliveryType(DeliveryType.ONETIME)
                        .cost(2000)
                        .isDiscount(DisplayStatus.Y)
                        .discountRate(10)
                        .discountedPrice(1800)
                        .thumbnailImage("thumbnail2")
                        .stock(200)
                        .build()
        );
        Page<FindCustomerProductRes> productPage = new PageImpl<>(products, pageable, products.size());

        // 모킹된 service가 호출될 때 Page<FindCustomerProductRes>을 반환
        when(customerProductService.findAllProducts(companyId, deliveryType, categoryId, pageable)).thenReturn(productPage);

        // when & then
        mockMvc.perform(RestDocumentationRequestBuilders.get("/products/company/{companyId}", companyId)
                        .param("deliveryType", deliveryType.name())
                        .param("categoryId", categoryId.toString())
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].productId").value(1L))
                .andExpect(jsonPath("$.content[0].name").value("product1"))
                .andExpect(jsonPath("$.content[0].categoryName").value("category1"))
                .andExpect(jsonPath("$.content[0].cost").value(1000))
                .andExpect(jsonPath("$.content[0].isDiscount").value("N"))
                .andExpect(jsonPath("$.content[0].discountRate").value(0))
                .andExpect(jsonPath("$.content[0].discountedPrice").value(1000))
                .andExpect(jsonPath("$.content[0].thumbnailImage").value("thumbnail1"))
                .andExpect(jsonPath("$.content[0].stock").value(100))
                .andExpect(jsonPath("$.content[1].productId").value(2L))
                .andExpect(jsonPath("$.content[1].name").value("product2"))
                .andExpect(jsonPath("$.content[1].categoryName").value("category2"))
                .andExpect(jsonPath("$.content[1].cost").value(2000))
                .andExpect(jsonPath("$.content[1].isDiscount").value("Y"))
                .andExpect(jsonPath("$.content[1].discountRate").value(10))
                .andExpect(jsonPath("$.content[1].discountedPrice").value(1800))
                .andExpect(jsonPath("$.content[1].thumbnailImage").value("thumbnail2"))
                .andExpect(jsonPath("$.content[1].stock").value(200))
                .andDo(document("Product/findAllCustomerProductsWithCategory",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("companyId").description("사업체 ID")
                        ),
                        RequestDocumentation.queryParameters(
                                parameterWithName("deliveryType").description("배달 유형"),
                                parameterWithName("categoryId").description("카테고리 ID").optional(),
                                parameterWithName("page").description("페이지 번호"),
                                parameterWithName("size").description("페이지 크기")
                        ),
                        PayloadDocumentation.responseFields(
                                PayloadDocumentation.fieldWithPath("content[].productId").type(JsonFieldType.NUMBER).description("상품 ID"),
                                PayloadDocumentation.fieldWithPath("content[].name").type(JsonFieldType.STRING).description("상품 이름"),
                                PayloadDocumentation.fieldWithPath("content[].categoryName").type(JsonFieldType.STRING).description("카테고리 이름"),
                                PayloadDocumentation.fieldWithPath("content[].deliveryType").type(JsonFieldType.STRING).description("배송 타입"),
                                PayloadDocumentation.fieldWithPath("content[].cost").type(JsonFieldType.NUMBER).description("가격"),
                                PayloadDocumentation.fieldWithPath("content[].isDiscount").type(JsonFieldType.STRING).description("할인 여부"),
                                PayloadDocumentation.fieldWithPath("content[].discountRate").type(JsonFieldType.NUMBER).description("할인율"),
                                PayloadDocumentation.fieldWithPath("content[].discountedPrice").type(JsonFieldType.NUMBER).description("할인된 가격"),
                                PayloadDocumentation.fieldWithPath("content[].thumbnailImage").type(JsonFieldType.STRING).description("썸네일 이미지 URL"),
                                PayloadDocumentation.fieldWithPath("content[].stock").type(JsonFieldType.NUMBER).description("재고"),
                                PayloadDocumentation.fieldWithPath("pageable").ignored(),
                                PayloadDocumentation.fieldWithPath("totalPages").ignored(),
                                PayloadDocumentation.fieldWithPath("totalElements").ignored(),
                                PayloadDocumentation.fieldWithPath("last").ignored(),
                                PayloadDocumentation.fieldWithPath("numberOfElements").ignored(),
                                PayloadDocumentation.fieldWithPath("first").ignored(),
                                PayloadDocumentation.fieldWithPath("size").ignored(),
                                PayloadDocumentation.fieldWithPath("number").ignored(),
                                PayloadDocumentation.fieldWithPath("empty").ignored(),
                                PayloadDocumentation.fieldWithPath("sort.empty").ignored(),
                                PayloadDocumentation.fieldWithPath("sort.sorted").ignored(),
                                PayloadDocumentation.fieldWithPath("sort.unsorted").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.pageNumber").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.pageSize").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.sort.empty").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.sort.sorted").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.sort.unsorted").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.offset").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.paged").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.unpaged").ignored()
                        )
                ));
    }
}
