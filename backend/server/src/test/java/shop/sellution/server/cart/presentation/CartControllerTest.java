package shop.sellution.server.cart.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.restdocs.payload.PayloadDocumentation;
import org.springframework.restdocs.request.RequestDocumentation;
import shop.sellution.server.cart.application.CartService;
import shop.sellution.server.cart.domain.type.CartType;
import shop.sellution.server.cart.dto.response.FindCartProductRes;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.common.BaseControllerTest;

import java.util.List;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@WebMvcTest(CartController.class)
class CartControllerTest extends BaseControllerTest {

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CartService cartService;

    @DisplayName("장바구니 목록 조회 성공")
    @Test
    void findCart_Success() throws Exception {
        // given
        CartType cartType = CartType.ONETIME;
        List<FindCartProductRes> cartItems = List.of(
                FindCartProductRes.builder()
                        .productId(1L)
                        .name("Product 1")
                        .categoryName("Category 1")
                        .deliveryType(DeliveryType.ONETIME)
                        .cost(1000)
                        .quantity(2)
                        .isDiscount(DisplayStatus.Y)
                        .discountRate(10)
                        .discountedPrice(900)
                        .thumbnailImage("image1.jpg")
                        .stock(50)
                        .isVisible(DisplayStatus.Y)
                        .build(),
                FindCartProductRes.builder()
                        .productId(2L)
                        .name("Product 2")
                        .categoryName("Category 2")
                        .deliveryType(DeliveryType.SUBSCRIPTION)
                        .cost(2000)
                        .quantity(1)
                        .isDiscount(DisplayStatus.Y)
                        .discountRate(0)
                        .discountedPrice(2000)
                        .thumbnailImage("image2.jpg")
                        .stock(30)
                        .isVisible(DisplayStatus.Y)
                        .build()
        );

        // when
        when(cartService.findCart(cartType)).thenReturn(cartItems);

        // then
        mockMvc.perform(get("/api/cart/{cartType}", cartType)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(cartItems)))
                .andDo(document("Cart/findCart",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("cartType").description("장바구니 유형")
                        ),
                        PayloadDocumentation.responseFields(
                                PayloadDocumentation.fieldWithPath("[].productId").type(JsonFieldType.NUMBER).description("상품 ID"),
                                PayloadDocumentation.fieldWithPath("[].name").type(JsonFieldType.STRING).description("상품 이름"),
                                PayloadDocumentation.fieldWithPath("[].categoryName").type(JsonFieldType.STRING).description("카테고리 이름"),
                                PayloadDocumentation.fieldWithPath("[].deliveryType").type(JsonFieldType.STRING).description("배송 유형"),
                                PayloadDocumentation.fieldWithPath("[].cost").type(JsonFieldType.NUMBER).description("상품 가격"),
                                PayloadDocumentation.fieldWithPath("[].quantity").type(JsonFieldType.NUMBER).description("상품 수량"),
                                PayloadDocumentation.fieldWithPath("[].isDiscount").type(JsonFieldType.STRING).description("할인 여부"),
                                PayloadDocumentation.fieldWithPath("[].discountRate").type(JsonFieldType.NUMBER).description("할인율"),
                                PayloadDocumentation.fieldWithPath("[].discountedPrice").type(JsonFieldType.NUMBER).description("할인된 가격"),
                                PayloadDocumentation.fieldWithPath("[].thumbnailImage").type(JsonFieldType.STRING).description("썸네일 이미지"),
                                PayloadDocumentation.fieldWithPath("[].stock").type(JsonFieldType.NUMBER).description("재고"),
                                PayloadDocumentation.fieldWithPath("[].isVisible").type(JsonFieldType.STRING).description("노출 여부")
                        )
                ));
    }

    @DisplayName("장바구니에 상품 추가 성공")
    @Test
    void addToCart_Success() throws Exception {
        // given
        CartType cartType = CartType.ONETIME;
        Long productId = 1L;
        int quantity = 2;

        // when
        doNothing().when(cartService).addToCart(cartType, productId, quantity);

        // then
        mockMvc.perform(post("/api/cart/add/{cartType}", cartType)
                        .queryParam("productId", productId.toString())
                        .queryParam("quantity", String.valueOf(quantity))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Cart/addToCart",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("cartType").description("장바구니 유형")
                        ),
                        RequestDocumentation.queryParameters(
                                parameterWithName("productId").description("상품 ID"),
                                parameterWithName("quantity").description("상품 수량")
                        )
                ));
    }






    @DisplayName("장바구니에서 상품 제거 성공")
    @Test
    void removeFromCart_Success() throws Exception {
        // given
        CartType cartType = CartType.ONETIME;
        Long productId = 1L;

        // when
        doNothing().when(cartService).removeFromCart(cartType, productId);

        // then
        mockMvc.perform(delete("/api/cart/remove/{cartType}/{productId}", cartType, productId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Cart/removeFromCart",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("cartType").description("장바구니 유형"),
                                parameterWithName("productId").description("상품 ID")
                        )
                ));
    }

    @DisplayName("장바구니 전체 삭제 성공")
    @Test
    void clearCart_Success() throws Exception {
        // given
        CartType cartType = CartType.ONETIME;

        // when
        doNothing().when(cartService).clearCart(cartType);

        // then
        mockMvc.perform(post("/api/cart/clear/{cartType}", cartType)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Cart/clearCart",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("cartType").description("장바구니 유형")
                        )
                ));
    }


    @DisplayName("장바구니 상품 수량 증가 성공")
    @Test
    void increaseCartItem_Success() throws Exception {
        // given
        CartType cartType = CartType.ONETIME;
        Long productId = 1L;

        // when
        doNothing().when(cartService).increaseCartItem(cartType, productId);

        // then
        mockMvc.perform(post("/api/cart/increase/{cartType}/{productId}", cartType, productId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Cart/increaseCartItem",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("cartType").description("장바구니 유형"),
                                parameterWithName("productId").description("상품 ID")
                        )
                ));
    }


    @DisplayName("장바구니 상품 수량 감소 성공")
    @Test
    void decreaseCartItem_Success() throws Exception {
        // given
        CartType cartType = CartType.ONETIME;
        Long productId = 1L;

        // when
        doNothing().when(cartService).decreaseCartItem(cartType, productId);

        // then
        mockMvc.perform(post("/api/cart/decrease/{cartType}/{productId}", cartType, productId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Cart/decreaseCartItem",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("cartType").description("장바구니 유형"),
                                parameterWithName("productId").description("상품 ID")
                        )
                ));
    }

}
