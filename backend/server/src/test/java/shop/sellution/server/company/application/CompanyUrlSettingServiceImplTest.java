package shop.sellution.server.company.application;

import org.mockito.MockedStatic;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.dto.FindCompanyUrlSettingRes;
import shop.sellution.server.company.dto.SaveCompanyUrlSettingReq;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.global.util.QRCodeGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class CompanyUrlSettingServiceImplTest {

    @Mock
    private CompanyRepository companyRepository;

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
        company.setShopUrl("https://www.sellution.shop/shopping/TestCompany");
    }

    @DisplayName("회사 URL 설정을 가져온다.")
    @Test
    void getCompanyUrlSetting_Success() {
        // given
        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(company));

        // when
        FindCompanyUrlSettingRes result = service.getCompanyUrlSetting(1L);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getCompanyId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("TestCompany");
        assertThat(result.getShopUrl()).isEqualTo("https://www.sellution.shop/shopping/TestCompany");
        assertThat(result.getIsShopVisible()).isEqualTo("Y");
        verify(companyRepository, times(1)).findById(1L);
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

//        byte[] mockQrCode = new byte[]{1, 2, 3};
        String mockQrCode = "mockQrCode";
        try (MockedStatic<QRCodeGenerator> qrCodeGeneratorMockedStatic = mockStatic(QRCodeGenerator.class)) {
            qrCodeGeneratorMockedStatic.when(() -> QRCodeGenerator.generateQRCodeImage(anyString(), anyInt(), anyInt()))
                    .thenReturn(mockQrCode);

            // when
            service.updateCompanyUrlSetting(requestDTO);

            // then
            verify(companyRepository, times(1)).save(any(Company.class));
            assertThat(company.getName()).isEqualTo("UpdatedCompany");
            assertThat(company.getShopUrl()).isEqualTo("https://www.sellution.shop/shopping/UpdatedCompany");
            assertThat(company.getIsShopVisible()).isEqualTo(DisplayStatus.N);
            assertThat(company.getQrCodeUrl()).isEqualTo(mockQrCode);
        }
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

        try (MockedStatic<QRCodeGenerator> qrCodeGeneratorMockedStatic = mockStatic(QRCodeGenerator.class)) {
            qrCodeGeneratorMockedStatic.when(() -> QRCodeGenerator.generateQRCodeImage(anyString(), anyInt(), anyInt()))
                    .thenThrow(new Exception("QR Code generation failed"));

            // when & then
            assertThatThrownBy(() -> service.updateCompanyUrlSetting(requestDTO))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessage("QR Code generation failed");
        }
    }
}