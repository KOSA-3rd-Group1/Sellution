package shop.sellution.server.company.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.dto.FindCompanyUrlSettingRes;
import shop.sellution.server.company.dto.SaveCompanyUrlSettingReq;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.S3Service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class CompanyUrlSettingServiceImplTest {

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private CompanyUrlSettingServiceImpl service;

    private Company company;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        company = new Company();
        company.setCompanyId(1L);
        company.setName("TestCompany");
        company.setIsShopVisible(DisplayStatus.Y);
        company.setShopUrl("https://www.sellution.shop/shopping/TestCompany/home");
    }

    @DisplayName("회사 URL 설정을 가져온다.")
    @Test
    void getCompanyUrlSetting_Success() throws Exception {
        // given
        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(company));
        when(s3Service.uploadQRCode(any(byte[].class), anyLong())).thenReturn("mockQrCodeUrl");

        // when
        FindCompanyUrlSettingRes result = service.getCompanyUrlSetting(1L);

        // then
        assertNotNull(result);
        assertEquals(1L, result.getCompanyId());
        assertEquals("TestCompany", result.getName());
        assertEquals("https://www.sellution.shop/shopping/TestCompany/home", result.getShopUrl());
        assertEquals("Y", result.getIsShopVisible());
        verify(companyRepository, times(1)).findById(1L);
        verify(s3Service, times(1)).uploadQRCode(any(byte[].class), eq(1L));
    }

    @DisplayName("회사 URL 설정을 업데이트한다.")
    @Test
    void updateCompanyUrlSetting_Success() throws Exception {
        // given
        SaveCompanyUrlSettingReq requestDTO = SaveCompanyUrlSettingReq.builder()
                .companyId(1L)
                .name("UpdatedCompany")
                .isShopVisible("N")
                .build();

        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(company));
        when(s3Service.uploadQRCode(any(byte[].class), anyLong())).thenReturn("mockQrCodeUrl");

        // when
        service.updateCompanyUrlSetting(requestDTO);

        // then
        verify(companyRepository, times(1)).save(any(Company.class));
        assertEquals("UpdatedCompany", company.getName());
        assertEquals("https://www.sellution.shop/shopping/UpdatedCompany/home", company.getShopUrl());
        assertEquals(DisplayStatus.N, company.getIsShopVisible());
        assertEquals("mockQrCodeUrl", company.getQrCodeUrl());
        verify(s3Service, times(1)).uploadQRCode(any(byte[].class), eq(1L));
    }

    @DisplayName("QR 코드 생성 실패 시 예외를 던진다.")
    @Test
    void updateCompanyUrlSetting_QRCodeGenerationFailed() throws Exception {
        // given
        SaveCompanyUrlSettingReq requestDTO = SaveCompanyUrlSettingReq.builder()
                .companyId(1L)
                .name("UpdatedCompany")
                .isShopVisible("N")
                .build();

        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(company));
        when(s3Service.uploadQRCode(any(byte[].class), anyLong())).thenThrow(new RuntimeException("QR Code upload failed"));

        // when & then
        assertThrows(RuntimeException.class, () -> service.updateCompanyUrlSetting(requestDTO));
    }

    @DisplayName("존재하지 않는 회사에 대한 요청 시 예외를 던진다.")
    @Test
    void getCompanyUrlSetting_NotFound() {
        // given
        when(companyRepository.findById(anyLong())).thenReturn(Optional.empty());

        // when & then
        assertThrows(BadRequestException.class, () -> service.getCompanyUrlSetting(999L));
    }
}