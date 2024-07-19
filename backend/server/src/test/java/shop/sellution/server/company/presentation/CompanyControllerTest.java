package shop.sellution.server.company.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.company.application.CompanyDisplaySettingServiceImpl;
import shop.sellution.server.company.application.CompanySaleSettingServiceImpl;
import shop.sellution.server.company.application.CompanyUrlSettingServiceImpl;
import shop.sellution.server.company.domain.type.SellType;
import shop.sellution.server.company.domain.type.SubscriptionType;
import shop.sellution.server.company.dto.*;
import shop.sellution.server.global.type.DeliveryType;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CompanyController.class)
class CompanyControllerTest extends BaseControllerTest {

    @MockBean
    private CompanyUrlSettingServiceImpl companyUrlSettingService;

    @MockBean
    private CompanyDisplaySettingServiceImpl companyDisplaySettingService;

    @MockBean
    private CompanySaleSettingServiceImpl companySaleSettingService;

    @Autowired
    private ObjectMapper objectMapper;

    @DisplayName("회사의 URL 설정을 조회한다")
    @Test
    void getCompanyUrlSetting_Success() throws Exception {
        FindCompanyUrlSettingRes response = FindCompanyUrlSettingRes.builder()
                .companyId(1L)
                .name("TestCompany")
                .shopUrl("https://www.sellution.com/shopping/TestCompany")
                .isShopVisible("Y")
                .qrCodeBase64("dummyQrCodeBase64String")
                .build();

        when(companyUrlSettingService.getCompanyUrlSetting(anyLong())).thenReturn(response);

        mockMvc.perform(get("/url-setting/{companyId}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("TestCompany"))
                .andDo(document("Company/findCompanyUrlSetting",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("companyId").description("회사 ID")
                        ),
                        responseFields(
                                fieldWithPath("companyId").description("회사 ID"),
                                fieldWithPath("name").description("회사 이름"),
                                fieldWithPath("shopUrl").description("쇼핑몰 URL"),
                                fieldWithPath("isShopVisible").description("쇼핑몰 공개 여부"),
                                fieldWithPath("qrCodeBase64").description("QR 코드 (Base64 인코딩)")
                        )
                ));
    }

    @DisplayName("회사의 URL 설정을 업데이트한다")
    @Test
    void updateCompanyUrlSetting_Success() throws Exception {
        SaveCompanyUrlSettingReq request = SaveCompanyUrlSettingReq.builder()
                .companyId(1L)
                .name("UpdatedCompany")
                .isShopVisible("N")
                .build();

        doNothing().when(companyUrlSettingService).updateCompanyUrlSetting(any(SaveCompanyUrlSettingReq.class));

        mockMvc.perform(put("/url-setting")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andDo(document("Company/updateCompanyUrlSetting",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").description("회사 ID"),
                                fieldWithPath("name").description("회사 이름"),
                                fieldWithPath("isShopVisible").description("쇼핑몰 공개 여부")
                        )
                ));
    }

    @DisplayName("회사의 디스플레이 설정을 조회한다")
    @Test
    void getCompanyDisplaySetting_Success() throws Exception {
        FindCompanyDisplaySettingRes response = FindCompanyDisplaySettingRes.builder()
                .companyId(1L)
                .displayName("TestDisplay")
                .logoImageUrl("logo.jpg")
                .promotionImageUrls(List.of("promo1.jpg", "promo2.jpg"))
                .themeColor("FFFFFF")
                .mainPromotion1Title("Promo1")
                .mainPromotion1Content("Content1")
                .mainPromotion2Title("Promo2")
                .mainPromotion2Content("Content2")
                .build();

        when(companyDisplaySettingService.getCompanyDisplaySetting(anyLong())).thenReturn(response);

        mockMvc.perform(get("/display-setting/{companyId}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.displayName").value("TestDisplay"))
                .andDo(document("Company/findCompanyDisplaySetting",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("companyId").description("회사 ID")
                        ),
                        responseFields(
                                fieldWithPath("companyId").description("회사 ID"),
                                fieldWithPath("displayName").description("디스플레이 이름"),
                                fieldWithPath("logoImageUrl").description("로고 이미지 URL"),
                                fieldWithPath("promotionImageUrls").description("프로모션 이미지 URL 목록"),
                                fieldWithPath("themeColor").description("테마 색상"),
                                fieldWithPath("mainPromotion1Title").description("주요 프로모션 1 제목"),
                                fieldWithPath("mainPromotion1Content").description("주요 프로모션 1 내용"),
                                fieldWithPath("mainPromotion2Title").description("주요 프로모션 2 제목"),
                                fieldWithPath("mainPromotion2Content").description("주요 프로모션 2 내용")
                        )
                ));
    }

    @DisplayName("회사의 디스플레이 설정을 업데이트한다")
    @Test
    void updateCompanyDisplaySetting_Success() throws Exception {
        SaveCompanyDisplaySettingReq request = SaveCompanyDisplaySettingReq.builder()
                .companyId(1L)
                .displayName("UpdatedDisplay")
                .logoImageUrl("new_logo.jpg")
                .promotionImageUrls(List.of("new_promo1.jpg", "new_promo2.jpg"))
                .themeColor("000000")
                .mainPromotion1Title("New Promo1")
                .mainPromotion1Content("New Content1")
                .mainPromotion2Title("New Promo2")
                .mainPromotion2Content("New Content2")
                .build();

        doNothing().when(companyDisplaySettingService).updateCompanyDisplaySetting(any(SaveCompanyDisplaySettingReq.class));

        mockMvc.perform(put("/display-setting")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andDo(document("Company/updateCompanyDisplaySetting",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").description("회사 ID"),
                                fieldWithPath("displayName").description("디스플레이 이름"),
                                fieldWithPath("logoImageUrl").description("로고 이미지 URL"),
                                fieldWithPath("promotionImageUrls").description("프로모션 이미지 URL 목록"),
                                fieldWithPath("themeColor").description("테마 색상"),
                                fieldWithPath("mainPromotion1Title").description("주요 프로모션 1 제목"),
                                fieldWithPath("mainPromotion1Content").description("주요 프로모션 1 내용"),
                                fieldWithPath("mainPromotion2Title").description("주요 프로모션 2 제목"),
                                fieldWithPath("mainPromotion2Content").description("주요 프로모션 2 내용")
                        )
                ));
    }

    @DisplayName("회사의 판매 설정을 조회한다")
    @Test
    void getCompanySaleSetting_Success() throws Exception {
        FindCompanySaleSettingRes response = FindCompanySaleSettingRes.builder()
                .companyId(1L)
                .serviceType(DeliveryType.BOTH)
                .sellType(SellType.ALL)
                .subscriptionType(SubscriptionType.MONTH)
                .minDeliveryCount(5)
                .maxDeliveryCount(10)
                .monthValues(List.of(1, 2, 3))
                .weekValues(List.of(1,2,4))
                .dayValues(List.of("MON", "TUE"))
                .categoryIds(List.of(1L, 2L))
                .productIds(List.of(3L, 4L))
                .build();

        when(companySaleSettingService.getCompanySaleSetting(anyLong())).thenReturn(response);

        mockMvc.perform(get("/sale-setting/{companyId}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.serviceType").value("BOTH"))
                .andDo(document("Company/findCompanySaleSetting",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("companyId").description("회사 ID")
                        ),
                        responseFields(
                                fieldWithPath("companyId").description("회사 ID"),
                                fieldWithPath("serviceType").description("서비스 유형"),
                                fieldWithPath("sellType").description("판매 유형"),
                                fieldWithPath("subscriptionType").description("구독 유형"),
                                fieldWithPath("minDeliveryCount").description("최소 배송 횟수"),
                                fieldWithPath("maxDeliveryCount").description("최대 배송 횟수"),
                                fieldWithPath("monthValues").description("월 옵션 목록"),
                                fieldWithPath("weekValues").description("주 옵션 목록"),
                                fieldWithPath("dayValues").description("일 옵션 목록"),
                                fieldWithPath("categoryIds").description("카테고리 ID 목록"),
                                fieldWithPath("productIds").description("제품 ID 목록")
                        )
                ));
    }

    @DisplayName("회사의 판매 설정을 업데이트한다")
    @Test
    void updateCompanySaleSetting_Success() throws Exception {
        SaveCompanySaleSettingReq request = SaveCompanySaleSettingReq.builder()
                .companyId(1L)
                .serviceType(DeliveryType.BOTH)
                .sellType(SellType.ALL)
                .subscriptionType(SubscriptionType.MONTH)
                .minDeliveryCount(5)
                .maxDeliveryCount(10)
                .monthOptions(List.of(1, 2, 3))
                .weekOptions(List.of(1,2,3))
                .dayOptions(List.of("1", "15"))
                .categories(List.of(1L, 2L))
                .products(List.of(3L, 4L))
                .build();

        doNothing().when(companySaleSettingService).updateCompanySaleSetting(any(SaveCompanySaleSettingReq.class));

        mockMvc.perform(put("/sale-setting")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andDo(document("Company/updateCompanySaleSetting",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").description("회사 ID"),
                                fieldWithPath("serviceType").description("서비스 유형"),
                                fieldWithPath("sellType").description("판매 유형"),
                                fieldWithPath("subscriptionType").description("구독 유형"),
                                fieldWithPath("minDeliveryCount").description("최소 배송 횟수"),
                                fieldWithPath("maxDeliveryCount").description("최대 배송 횟수"),
                                fieldWithPath("monthOptions").description("월 옵션 목록"),
                                fieldWithPath("weekOptions").description("주 옵션 목록"),
                                fieldWithPath("dayOptions").description("일 옵션 목록"),
                                fieldWithPath("categories").description("카테고리 ID 목록"),
                                fieldWithPath("products").description("제품 ID 목록")
                        )
                ));
    }
}
