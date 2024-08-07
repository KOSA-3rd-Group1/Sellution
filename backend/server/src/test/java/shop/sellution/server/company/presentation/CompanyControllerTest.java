package shop.sellution.server.company.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.company.application.CompanyDisplaySettingServiceImpl;
import shop.sellution.server.company.application.CompanySaleSettingServiceImpl;
import shop.sellution.server.company.application.CompanyServiceImpl;
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
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;

import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CompanyController.class)
class CompanyControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CompanyUrlSettingServiceImpl companyUrlSettingService;

    @MockBean
    private CompanyDisplaySettingServiceImpl companyDisplaySettingService;

    @MockBean
    private CompanySaleSettingServiceImpl companySaleSettingService;

    @MockBean
    private CompanyServiceImpl companyService;

    @Autowired
    private ObjectMapper objectMapper;

    @DisplayName("회사의 URL 설정을 조회한다")
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void getCompanyUrlSetting_Success() throws Exception {
        FindCompanyUrlSettingRes response = FindCompanyUrlSettingRes.builder()
                .companyId(1L)
                .name("TestCompany")
                .shopUrl("https://www.sellution.com/shopping/TestCompany")
                .isShopVisible("Y")
                .qrCodeUrl("https://example.com/qr-code.png")
                .build();

        when(companyUrlSettingService.getCompanyUrlSetting(anyLong())).thenReturn(response);

        mockMvc.perform(get("/url-setting/{companyId}", 1L)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("TestCompany"))
                .andDo(document("Company/findCompanyUrlSetting",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("companyId").description("회사 ID")
                        ),
                        responseFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("회사명"),
                                fieldWithPath("shopUrl").type(JsonFieldType.STRING).description("쇼핑몰 URL"),
                                fieldWithPath("isShopVisible").type(JsonFieldType.STRING).description("쇼핑몰 공개 여부"),
                                fieldWithPath("qrCodeUrl").type(JsonFieldType.STRING).description("QR 코드 URL")
                        )
                ));
    }

    @DisplayName("회사의 URL 설정을 업데이트한다")
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void updateCompanyUrlSetting_Success() throws Exception {
        SaveCompanyUrlSettingReq request = SaveCompanyUrlSettingReq.builder()
                .companyId(1L)
                .name("UpdatedCompany")
                .isShopVisible("N")
                .build();

        doNothing().when(companyUrlSettingService).updateCompanyUrlSetting(any(SaveCompanyUrlSettingReq.class));

        mockMvc.perform(put("/url-setting")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andDo(document("Company/updateCompanyUrlSetting",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("회사명"),
                                fieldWithPath("isShopVisible").type(JsonFieldType.STRING).description("쇼핑몰 공개 여부")
                        )
                ));
    }

    @DisplayName("회사의 디스플레이 설정을 조회한다")
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void getCompanyDisplaySetting_Success() throws Exception {
        FindCompanyDisplaySettingRes response = FindCompanyDisplaySettingRes.builder()
                .companyId(1L)
                .displayName("TestDisplay")
                .logoImageUrl("logo.jpg")
                .promotionImageUrls(List.of("promo1.jpg", "promo2.jpg"))
                .serviceType(DeliveryType.BOTH)
                .themeColor("#FFFFFF")
                .mainPromotion1Title("Promo 1")
                .mainPromotion1Content("Content 1")
                .mainPromotion2Title("Promo 2")
                .mainPromotion2Content("Content 2")
                .build();

        when(companyDisplaySettingService.getCompanyDisplaySetting(anyLong())).thenReturn(response);

        mockMvc.perform(get("/display-setting/{companyId}", 1L)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.displayName").value("TestDisplay"))
                .andDo(document("Company/findCompanyDisplaySetting",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("companyId").description("회사 ID")
                        ),
                        responseFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("displayName").type(JsonFieldType.STRING).description("디스플레이 이름"),
                                fieldWithPath("logoImageUrl").type(JsonFieldType.STRING).description("로고 이미지 URL"),
                                fieldWithPath("promotionImageUrls").type(JsonFieldType.ARRAY).description("프로모션 이미지 URL 목록"),
                                fieldWithPath("serviceType").type(JsonFieldType.STRING).description("서비스 타입").optional(),
                                fieldWithPath("themeColor").type(JsonFieldType.STRING).description("테마 색상").optional(),
                                fieldWithPath("mainPromotion1Title").type(JsonFieldType.STRING).description("메인 프로모션 1 제목").optional(),
                                fieldWithPath("mainPromotion1Content").type(JsonFieldType.STRING).description("메인 프로모션 1 내용").optional(),
                                fieldWithPath("mainPromotion2Title").type(JsonFieldType.STRING).description("메인 프로모션 2 제목").optional(),
                                fieldWithPath("mainPromotion2Content").type(JsonFieldType.STRING).description("메인 프로모션 2 내용").optional()
                        )
                ));
    }

    @DisplayName("회사의 디스플레이 설정을 생성한다")
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void createCompanyDisplaySetting_Success() throws Exception {
        MockMultipartFile logoFile = new MockMultipartFile("logoFile", "logo.jpg", "image/jpeg", "logo content".getBytes());
        MockMultipartFile promoFile = new MockMultipartFile("promotionFiles", "promo1.jpg", "image/jpeg", "promo1 content".getBytes());

        SaveCompanyDisplaySettingReq request = SaveCompanyDisplaySettingReq.builder()
                .companyId(1L)
                .displayName("NewDisplay")
                .themeColor("#FFFFFF")
                .mainPromotion1Title("Promo1")
                .mainPromotion1Content("Content1")
                .mainPromotion2Title("Promo2")
                .mainPromotion2Content("Content2")
                .build();

        MockMultipartFile requestPart = new MockMultipartFile("request", "", "application/json", objectMapper.writeValueAsBytes(request));

        doNothing().when(companyDisplaySettingService).createCompanyDisplaySetting(any(SaveCompanyDisplaySettingReq.class), any(), any());

        mockMvc.perform(multipart("/display-setting")
                        .file(logoFile)
                        .file(promoFile)
                        .file(requestPart)
                        .param("displayName", "NewDisplay")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andDo(document("Company/createCompanyDisplaySetting",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestParts(
                                partWithName("logoFile").description("로고 파일"),
                                partWithName("promotionFiles").description("프로모션 이미지 파일"),
                                partWithName("request").description("회사 디스플레이 설정 정보")
                        ),
                        requestPartFields("request",
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("displayName").type(JsonFieldType.STRING).description("디스플레이 이름"),
                                fieldWithPath("logoImageUrl").type(JsonFieldType.STRING).optional().description("로고 이미지 URL"),
                                fieldWithPath("promotionImageUrls").type(JsonFieldType.ARRAY).optional().description("프로모션 이미지 URL 목록"),
                                fieldWithPath("themeColor").type(JsonFieldType.STRING).description("테마 색상"),
                                fieldWithPath("mainPromotion1Title").type(JsonFieldType.STRING).description("메인 프로모션 1 제목"),
                                fieldWithPath("mainPromotion1Content").type(JsonFieldType.STRING).description("메인 프로모션 1 내용"),
                                fieldWithPath("mainPromotion2Title").type(JsonFieldType.STRING).description("메인 프로모션 2 제목"),
                                fieldWithPath("mainPromotion2Content").type(JsonFieldType.STRING).description("메인 프로모션 2 내용")
                        )
                ));
    }


    @DisplayName("회사의 디스플레이 설정을 업데이트한다")
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void updateCompanyDisplaySetting_Success() throws Exception {
        SaveCompanyDisplaySettingReq requestDTO = SaveCompanyDisplaySettingReq.builder()
                .companyId(1L)
                .displayName("UpdatedDisplay")
                .build();

        MockMultipartFile requestPart = new MockMultipartFile("request", "", "application/json", objectMapper.writeValueAsBytes(requestDTO));
        MockMultipartFile logoFile = new MockMultipartFile("logoFile", "logo.jpg", "image/jpeg", "logo content".getBytes());
        MockMultipartFile promoFile = new MockMultipartFile("promotionFiles", "promo1.jpg", "image/jpeg", "promo1 content".getBytes());

        doNothing().when(companyDisplaySettingService).updateCompanyDisplaySetting(any(SaveCompanyDisplaySettingReq.class), any(), any());

        mockMvc.perform(multipart("/display-setting")
                        .file(requestPart)
                        .file(logoFile)
                        .file(promoFile)
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        })
                        .with(csrf()))
                .andExpect(status().isOk())
                .andDo(document("Company/updateCompanyDisplaySetting",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestParts(
                                partWithName("request").description("업데이트 요청 DTO"),
                                partWithName("logoFile").description("로고 파일"),
                                partWithName("promotionFiles").description("프로모션 이미지 파일")
                        )
                ));
    }
    @DisplayName("회사의 판매 설정을 조회한다")
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void getCompanySaleSetting_Success() throws Exception {
        FindCompanySaleSettingRes response = FindCompanySaleSettingRes.builder()
                .companyId(1L)
                .serviceType(DeliveryType.BOTH)
                .sellType(SellType.ALL)
                .subscriptionType(SubscriptionType.MONTH)
                .categoryIds(null)
                .productIds(null)
                .minDeliveryCount(null)
                .maxDeliveryCount(null)
                .monthValues(null)
                .weekValues(null)
                .dayValues(null)
                .build();

        when(companySaleSettingService.getCompanySaleSetting(anyLong())).thenReturn(response);

        mockMvc.perform(get("/sale-setting/{companyId}", 1L)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.serviceType").value("BOTH"))
                .andDo(document("Company/getCompanySaleSetting-Success",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("companyId").description("회사 ID")
                        ),
                        responseFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("serviceType").type(JsonFieldType.STRING).description("서비스 타입"),
                                fieldWithPath("sellType").type(JsonFieldType.STRING).description("판매 타입"),
                                fieldWithPath("subscriptionType").type(JsonFieldType.STRING).description("구독 타입"),
                                fieldWithPath("categoryIds").type(JsonFieldType.ARRAY).optional().description("카테고리 ID 목록"),
                                fieldWithPath("productIds").type(JsonFieldType.ARRAY).optional().description("상품 ID 목록"),
                                fieldWithPath("minDeliveryCount").type(JsonFieldType.NUMBER).optional().description("최소 배송 횟수"),
                                fieldWithPath("maxDeliveryCount").type(JsonFieldType.NUMBER).optional().description("최대 배송 횟수"),
                                fieldWithPath("monthValues").type(JsonFieldType.ARRAY).optional().description("월 옵션"),
                                fieldWithPath("weekValues").type(JsonFieldType.ARRAY).optional().description("주 옵션"),
                                fieldWithPath("dayValues").type(JsonFieldType.ARRAY).optional().description("요일 옵션")
                        )
                ));
    }

    @DisplayName("회사의 판매 설정을 생성한다")
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void createCompanySaleSetting_Success() throws Exception {
        SaveCompanySaleSettingReq request = SaveCompanySaleSettingReq.builder()
                .companyId(1L)
                .serviceType(DeliveryType.BOTH)
                .sellType(SellType.ALL)
                .subscriptionType(SubscriptionType.MONTH)
                .minDeliveryCount(5)
                .maxDeliveryCount(10)
                .monthOptions(List.of(1, 2, 3))
                .weekOptions(List.of(1, 2))
                .dayOptions(List.of("MON", "TUE"))
                .build();

        doNothing().when(companySaleSettingService).createCompanySaleSetting(any(SaveCompanySaleSettingReq.class));

        mockMvc.perform(post("/sale-setting")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andDo(document("Company/createCompanySaleSetting",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("serviceType").type(JsonFieldType.STRING).description("서비스 타입"),
                                fieldWithPath("sellType").type(JsonFieldType.STRING).description("판매 타입"),
                                fieldWithPath("subscriptionType").type(JsonFieldType.STRING).description("구독 타입"),
                                fieldWithPath("minDeliveryCount").type(JsonFieldType.NUMBER).description("최소 배송 횟수"),
                                fieldWithPath("maxDeliveryCount").type(JsonFieldType.NUMBER).description("최대 배송 횟수"),
                                fieldWithPath("monthOptions").type(JsonFieldType.ARRAY).description("월 옵션"),
                                fieldWithPath("weekOptions").type(JsonFieldType.ARRAY).description("주 옵션"),
                                fieldWithPath("dayOptions").type(JsonFieldType.ARRAY).description("요일 옵션"),
                                fieldWithPath("categories").type(JsonFieldType.ARRAY).optional().description("카테고리 ID 목록"),
                                fieldWithPath("products").type(JsonFieldType.ARRAY).optional().description("상품 ID 목록")
                        )
                ));
    }

    @DisplayName("회사의 판매 설정을 업데이트한다")
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void updateCompanySaleSetting_Success() throws Exception {
        SaveCompanySaleSettingReq request = SaveCompanySaleSettingReq.builder()
                .companyId(1L)
                .serviceType(DeliveryType.BOTH)
                .sellType(SellType.ALL)
                .subscriptionType(SubscriptionType.MONTH)
                .minDeliveryCount(5)
                .maxDeliveryCount(10)
                .monthOptions(List.of(1, 2, 3))
                .weekOptions(List.of(1, 2))
                .dayOptions(List.of("MON", "TUE"))
                .build();

        doNothing().when(companySaleSettingService).updateCompanySaleSetting(any(SaveCompanySaleSettingReq.class));

        mockMvc.perform(put("/sale-setting")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andDo(document("Company/updateCompanySaleSetting",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("serviceType").type(JsonFieldType.STRING).description("서비스 타입"),
                                fieldWithPath("sellType").type(JsonFieldType.STRING).description("판매 타입"),
                                fieldWithPath("subscriptionType").type(JsonFieldType.STRING).description("구독 타입"),
                                fieldWithPath("minDeliveryCount").type(JsonFieldType.NUMBER).description("최소 배송 횟수"),
                                fieldWithPath("maxDeliveryCount").type(JsonFieldType.NUMBER).description("최대 배송 횟수"),
                                fieldWithPath("monthOptions").type(JsonFieldType.ARRAY).description("월 옵션"),
                                fieldWithPath("weekOptions").type(JsonFieldType.ARRAY).description("주 옵션"),
                                fieldWithPath("dayOptions").type(JsonFieldType.ARRAY).description("요일 옵션"),
                                fieldWithPath("categories").type(JsonFieldType.ARRAY).optional().description("카테고리 ID 목록"),
                                fieldWithPath("products").type(JsonFieldType.ARRAY).optional().description("상품 ID 목록")
                        )
                ));
    }

    @DisplayName("회사 정보를 조회한다")
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void getCompanyInfo_Success() throws Exception {
        FindCompanyInfoRes response = FindCompanyInfoRes.builder()
                .companyId(1L)
                .name("TestCompany")
                .displayName("TestDisplay")
                .logoImageUrl("logo.jpg")
                .promotionImageUrls(List.of("promo1.jpg", "promo2.jpg"))
                .serviceType(DeliveryType.BOTH)
                .subscriptionType(SubscriptionType.MONTH)
                .minDeliveryCount(5)
                .maxDeliveryCount(30)
                .themeColor("#FFFFFF")
                .mainPromotion1Title("Promo 1")
                .mainPromotion1Content("Content 1")
                .mainPromotion2Title("Promo 2")
                .mainPromotion2Content("Content 2")
                .build();

        when(companyService.findCompanyId(any())).thenReturn(response);

        mockMvc.perform(get("/shopping-find-companyId/{companyName}", "TestCompany")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("TestCompany"))
                .andDo(document("Company/findCompanyInfo",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("companyName").description("회사명")
                        ),
                        responseFields(
                                fieldWithPath("data.companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("data.name").type(JsonFieldType.STRING).description("회사명"),
                                fieldWithPath("data.displayName").type(JsonFieldType.STRING).description("디스플레이 이름"),
                                fieldWithPath("data.logoImageUrl").type(JsonFieldType.STRING).optional().description("로고 이미지 URL"),
                                fieldWithPath("data.promotionImageUrls").type(JsonFieldType.ARRAY).optional().description("프로모션 이미지 URL 목록"),
                                fieldWithPath("data.serviceType").type(JsonFieldType.STRING).optional().description("서비스 타입"),
                                fieldWithPath("data.subscriptionType").type(JsonFieldType.STRING).optional().description("구독 타입"),
                                fieldWithPath("data.minDeliveryCount").type(JsonFieldType.NUMBER).description("최소 배송 횟수"),
                                fieldWithPath("data.maxDeliveryCount").type(JsonFieldType.NUMBER).description("최대 배송 횟수"),
                                fieldWithPath("data.themeColor").type(JsonFieldType.STRING).optional().description("테마 색상"),
                                fieldWithPath("data.mainPromotion1Title").type(JsonFieldType.STRING).optional().description("메인 프로모션 1 제목"),
                                fieldWithPath("data.mainPromotion1Content").type(JsonFieldType.STRING).optional().description("메인 프로모션 1 내용"),
                                fieldWithPath("data.mainPromotion2Title").type(JsonFieldType.STRING).optional().description("메인 프로모션 2 제목"),
                                fieldWithPath("data.mainPromotion2Content").type(JsonFieldType.STRING).optional().description("메인 프로모션 2 내용")
                        )
                ));
    }
}