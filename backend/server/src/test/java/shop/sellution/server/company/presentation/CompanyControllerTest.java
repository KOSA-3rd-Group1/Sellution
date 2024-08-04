package shop.sellution.server.company.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.company.application.CompanyDisplaySettingServiceImpl;
import shop.sellution.server.company.application.CompanySaleSettingServiceImpl;
import shop.sellution.server.company.application.CompanyServiceImpl;
import shop.sellution.server.company.application.CompanyUrlSettingServiceImpl;
import shop.sellution.server.company.domain.type.SellType;
import shop.sellution.server.company.domain.type.SubscriptionType;
import shop.sellution.server.company.dto.*;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.type.DeliveryType;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
                .andExpect(jsonPath("$.name").value("TestCompany"));
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
                .andExpect(status().isOk());
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
                .build();

        when(companyDisplaySettingService.getCompanyDisplaySetting(anyLong())).thenReturn(response);

        mockMvc.perform(get("/display-setting/{companyId}", 1L)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.displayName").value("TestDisplay"));
    }

    @DisplayName("회사의 디스플레이 설정을 생성한다")
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void createCompanyDisplaySetting_Success() throws Exception {
        MockMultipartFile logoFile = new MockMultipartFile("logoFile", "logo.jpg", "image/jpeg", "logo content".getBytes());
        MockMultipartFile promoFile = new MockMultipartFile("promotionFiles", "promo1.jpg", "image/jpeg", "promo1 content".getBytes());

        doNothing().when(companyDisplaySettingService).createCompanyDisplaySetting(any(SaveCompanyDisplaySettingReq.class), any(), any());

        mockMvc.perform(multipart("/display-setting")
                        .file(logoFile)
                        .file(promoFile)
                        .param("companyId", "1")
                        .param("displayName", "NewDisplay")
                        .param("themeColor", "#FFFFFF")
                        .param("mainPromotion1Title", "Promo1")
                        .param("mainPromotion1Content", "Content1")
                        .param("mainPromotion2Title", "Promo2")
                        .param("mainPromotion2Content", "Content2")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andDo(result -> {
                    if (result.getResolvedException() != null) {
                        System.out.println("Exception: " + result.getResolvedException().getMessage());
                    }
                    System.out.println("Response: " + result.getResponse().getContentAsString());
                });
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
                .andExpect(status().isOk());
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
                .build();

        when(companySaleSettingService.getCompanySaleSetting(anyLong())).thenReturn(response);

        mockMvc.perform(get("/sale-setting/{companyId}", 1L)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.serviceType").value("BOTH"));
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

        MvcResult result = mockMvc.perform(post("/sale-setting")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        if (result.getResolvedException() != null) {
            System.out.println("Exception: " + result.getResolvedException().getMessage());
            result.getResolvedException().printStackTrace();
        }
        System.out.println("Response: " + result.getResponse().getContentAsString());
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
                .build();

        doNothing().when(companySaleSettingService).updateCompanySaleSetting(any(SaveCompanySaleSettingReq.class));

        mockMvc.perform(put("/sale-setting")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @DisplayName("회사 정보를 조회한다")
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void getCompanyInfo_Success() throws Exception {
        FindCompanyInfoRes response = FindCompanyInfoRes.builder()
                .companyId(1L)
                .name("TestCompany")
                .build();

        when(companyService.findCompanyId(any())).thenReturn(response);

        mockMvc.perform(get("/shopping-find-companyId/{companyName}", "TestCompany")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("TestCompany"));
    }
}