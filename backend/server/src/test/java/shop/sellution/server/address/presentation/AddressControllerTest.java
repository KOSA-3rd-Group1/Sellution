package shop.sellution.server.address.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import shop.sellution.server.address.application.AddressServiceImpl;
import shop.sellution.server.address.dto.request.SaveAddressReq;
import shop.sellution.server.address.dto.response.FindAddressRes;
import shop.sellution.server.address.dto.response.FindAllAddressRes;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.global.type.DisplayStatus;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(AddressController.class)
class AddressControllerTest extends BaseControllerTest {

    @MockBean
    private AddressServiceImpl addressService;

    @Autowired
    private ObjectMapper objectMapper;

    @DisplayName("고객 ID로 주소 목록을 조회한다")
    @Test
    void getAddressesByCustomerId_Success() throws Exception {
        // given
        Long customerId = 1L;
        List<FindAllAddressRes> addresses = List.of(
                FindAllAddressRes.builder()
                        .addressId(1L)
                        .addressName("집")
                        .isDefaultAddress(DisplayStatus.Y)
                        .name("홍길동")
                        .phoneNumber("01012345678")
                        .streetAddress("서울시 강남구")
                        .addressDetail("123-456")
                        .build(),
                FindAllAddressRes.builder()
                        .addressId(2L)
                        .addressName("회사")
                        .isDefaultAddress(DisplayStatus.N)
                        .name("홍길동")
                        .phoneNumber("01087654321")
                        .streetAddress("서울시 서초구")
                        .addressDetail("789-012")
                        .build()
        );

        when(addressService.getAddressesByCustomerId(customerId)).thenReturn(addresses);

        // when & then
        mockMvc.perform(get("/addresses/customer/{customerId}", customerId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].addressName").value("집"))
                .andExpect(jsonPath("$[1].addressName").value("회사"))
                .andDo(document("Address/findAddressesByCustomerId",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("customerId").description("고객 ID")
                        ),
                        responseFields(
                                fieldWithPath("[]").type(JsonFieldType.ARRAY).description("주소 목록"),
                                fieldWithPath("[].addressId").type(JsonFieldType.NUMBER).description("주소 ID"),
                                fieldWithPath("[].addressName").type(JsonFieldType.STRING).description("주소 이름"),
                                fieldWithPath("[].isDefaultAddress").type(JsonFieldType.STRING).description("기본 주소 여부"),
                                fieldWithPath("[].name").type(JsonFieldType.STRING).description("수령인 이름"),
                                fieldWithPath("[].phoneNumber").type(JsonFieldType.STRING).description("전화번호"),
                                fieldWithPath("[].streetAddress").type(JsonFieldType.STRING).description("도로명 주소"),
                                fieldWithPath("[].addressDetail").type(JsonFieldType.STRING).description("상세 주소")
                        )
                ));
    }

    @DisplayName("주소 ID로 주소 상세 정보를 조회한다")
    @Test
    void getAddressById_Success() throws Exception {
        // given
        Long addressId = 1L;
        FindAddressRes address = FindAddressRes.builder()
                .customerId(1L)
                .addressName("집")
                .name("홍길동")
                .phoneNumber("01012345678")
                .zipcode("12345")
                .streetAddress("서울시 강남구")
                .addressDetail("123-456")
                .isDefaultAddress(DisplayStatus.Y)
                .build();

        when(addressService.getAddressById(addressId)).thenReturn(address);

        // when & then
        mockMvc.perform(get("/addresses/{addressId}", addressId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.addressName").value("집"))
                .andDo(document("Address/findAddressById",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("addressId").description("주소 ID")
                        ),
                        responseFields(
                                fieldWithPath("customerId").type(JsonFieldType.NUMBER).description("고객 ID"),
                                fieldWithPath("addressName").type(JsonFieldType.STRING).description("주소 이름"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("수령인 이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호"),
                                fieldWithPath("zipcode").type(JsonFieldType.STRING).description("우편번호"),
                                fieldWithPath("streetAddress").type(JsonFieldType.STRING).description("도로명 주소"),
                                fieldWithPath("addressDetail").type(JsonFieldType.STRING).description("상세 주소"),
                                fieldWithPath("isDefaultAddress").type(JsonFieldType.STRING).description("기본 주소 여부")
                        )
                ));
    }

    @DisplayName("새로운 주소를 생성한다")
    @Test
    void createAddress_Success() throws Exception {
        // given
        SaveAddressReq addressReq = SaveAddressReq.builder()
                .customerId(1L)
                .addressName("새 주소")
                .name("홍길동")
                .phoneNumber("01012345678")
                .zipcode("12345")
                .streetAddress("서울시 강남구")
                .addressDetail("123-456")
                .isDefaultAddress(DisplayStatus.N)
                .build();

        doNothing().when(addressService).createAddress(any(SaveAddressReq.class));

        // when & then
        mockMvc.perform(post("/addresses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressReq)))
                .andExpect(status().isCreated())
                .andDo(document("Address/createAddress",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("customerId").type(JsonFieldType.NUMBER).description("고객 ID"),
                                fieldWithPath("addressName").type(JsonFieldType.STRING).description("주소 이름"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("수령인 이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호"),
                                fieldWithPath("zipcode").type(JsonFieldType.STRING).description("우편번호"),
                                fieldWithPath("streetAddress").type(JsonFieldType.STRING).description("도로명 주소"),
                                fieldWithPath("addressDetail").type(JsonFieldType.STRING).description("상세 주소"),
                                fieldWithPath("isDefaultAddress").type(JsonFieldType.STRING).description("기본 주소 여부")
                        )
                ));
    }

    @DisplayName("주소를 수정한다")
    @Test
    void updateAddress_Success() throws Exception {
        // given
        Long addressId = 1L;
        SaveAddressReq addressReq = SaveAddressReq.builder()
                .customerId(1L)
                .addressName("수정된 주소")
                .name("홍길동")
                .phoneNumber("01012345678")
                .zipcode("12345")
                .streetAddress("서울시 강남구")
                .addressDetail("123-456")
                .isDefaultAddress(DisplayStatus.Y)
                .build();

        doNothing().when(addressService).updateAddress(eq(addressId), any(SaveAddressReq.class));

        // when & then
        mockMvc.perform(put("/addresses/{addressId}", addressId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressReq)))
                .andExpect(status().isNoContent())
                .andDo(document("Address/updateAddress",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("addressId").description("주소 ID")
                        ),
                        requestFields(
                                fieldWithPath("customerId").type(JsonFieldType.NUMBER).description("고객 ID"),
                                fieldWithPath("addressName").type(JsonFieldType.STRING).description("주소 이름"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("수령인 이름"),
                                fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("전화번호"),
                                fieldWithPath("zipcode").type(JsonFieldType.STRING).description("우편번호"),
                                fieldWithPath("streetAddress").type(JsonFieldType.STRING).description("도로명 주소"),
                                fieldWithPath("addressDetail").type(JsonFieldType.STRING).description("상세 주소"),
                                fieldWithPath("isDefaultAddress").type(JsonFieldType.STRING).description("기본 주소 여부")
                        )
                ));
    }

    @DisplayName("주소를 삭제한다")
    @Test
    void deleteAddress_Success() throws Exception {
        // given
        Long addressId = 1L;

        doNothing().when(addressService).deleteAddress(addressId);

        // when & then
        mockMvc.perform(delete("/addresses/{addressId}", addressId))
                .andExpect(status().isNoContent())
                .andDo(document("Address/deleteAddress",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("addressId").description("주소 ID")
                        )
                ));
    }
}