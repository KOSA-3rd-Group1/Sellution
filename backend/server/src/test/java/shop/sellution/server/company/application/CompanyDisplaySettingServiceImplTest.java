package shop.sellution.server.company.application;

import org.springframework.mock.web.MockMultipartFile;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyImage;
import shop.sellution.server.company.domain.repository.CompanyImageRepository;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.domain.type.ImagePurposeType;
import shop.sellution.server.company.dto.FindCompanyDisplaySettingRes;
import shop.sellution.server.company.dto.SaveCompanyDisplaySettingReq;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import shop.sellution.server.product.S3Service;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CompanyDisplaySettingServiceImplTest {

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private CompanyImageRepository companyImageRepository;

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private CompanyDisplaySettingServiceImpl service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @DisplayName("회사 디스플레이 설정을 가져온다.")
    @Test
    void getCompanyDisplaySetting_Success() {
        // given
        Long companyId = 1L;
        Company company = new Company();
        company.setCompanyId(companyId);
        company.setName("Test Company");

        CompanyImage logoImage = new CompanyImage();
        logoImage.setImageUrl("logo.jpg");
        logoImage.setPurposeOfUse(ImagePurposeType.LOGO);

        CompanyImage promotionImage = new CompanyImage();
        promotionImage.setImageUrl("promo.jpg");
        promotionImage.setPurposeOfUse(ImagePurposeType.PROMOTION);

        List<CompanyImage> companyImages = Arrays.asList(logoImage, promotionImage);

        when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));
        when(companyImageRepository.findAllByCompany(company)).thenReturn(companyImages);

        // when & then
        FindCompanyDisplaySettingRes response = service.getCompanyDisplaySetting(companyId);

        assertNotNull(response);
        assertEquals(companyId, response.getCompanyId());
        assertEquals("Test Company", response.getDisplayName());
        assertEquals("logo.jpg", response.getLogoImageUrl());
        assertEquals(1, response.getPromotionImageUrls().size());
        assertEquals("promo.jpg", response.getPromotionImageUrls().get(0));

        verify(companyRepository).findById(companyId);
        verify(companyImageRepository).findAllByCompany(company);
    }

    @DisplayName("회사 디스플레이 설정을 업데이트한다.")
    @Test
    void updateCompanyDisplaySetting_Success() throws IOException {
        // given
        Long companyId = 1L;
        Company company = new Company();
        company.setCompanyId(companyId);

        SaveCompanyDisplaySettingReq requestDTO = new SaveCompanyDisplaySettingReq();
        requestDTO.setCompanyId(companyId);
        requestDTO.setDisplayName("Updated Company");

        MockMultipartFile logoFile = new MockMultipartFile("logoFile", "logo.jpg", "image/jpeg", "logo content".getBytes());
        MockMultipartFile promotionFile1 = new MockMultipartFile("promotionFiles", "promo1.jpg", "image/jpeg", "promo1 content".getBytes());
        MockMultipartFile promotionFile2 = new MockMultipartFile("promotionFiles", "promo2.jpg", "image/jpeg", "promo2 content".getBytes());

        when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));
        when(s3Service.uploadFile(logoFile, companyId, "setting")).thenReturn("uploaded_logo_url");
        when(s3Service.uploadFile(promotionFile1, companyId, "setting")).thenReturn("uploaded_promo1_url");
        when(s3Service.uploadFile(promotionFile2, companyId, "setting")).thenReturn("uploaded_promo2_url");
        when(companyImageRepository.findByCompanyAndPurposeOfUse(any(Company.class), eq(ImagePurposeType.LOGO))).thenReturn(Optional.empty());
        when(companyImageRepository.findAllByCompanyAndPurposeOfUse(any(Company.class), eq(ImagePurposeType.PROMOTION))).thenReturn(List.of());

        // when
        service.updateCompanyDisplaySetting(requestDTO, logoFile, Arrays.asList(promotionFile1, promotionFile2));

        // then
        verify(companyRepository).save(any(Company.class));
        verify(companyImageRepository, times(1)).save(any(CompanyImage.class)); // logo image
        verify(companyImageRepository).deleteAll(anyList()); // deleting existing promotion images
        verify(companyImageRepository, times(1)).saveAll(anyList()); // saving new promotion images
    }




    @DisplayName("로고 이미지를 저장한다.")
    @Test
    void saveLogoImage_Success() {
        // given
        CompanyImage logoImage = new CompanyImage();
        logoImage.setImageUrl("logo.jpg");

        // when & then
        service.saveLogoImage(logoImage);

        verify(companyImageRepository).save(logoImage);
    }

    @DisplayName("로고 이미지를 업데이트한다.")
    @Test
    void updateLogoImage_Success() {
        // given
        Company company = new Company();
        CompanyImage newLogoImage = new CompanyImage();
        newLogoImage.setImageUrl("new_logo.jpg");

        CompanyImage existingLogoImage = new CompanyImage();
        existingLogoImage.setImageUrl("old_logo.jpg");

        when(companyImageRepository.findByCompanyAndPurposeOfUse(company, ImagePurposeType.LOGO)).thenReturn(Optional.of(existingLogoImage));

        // when
        service.updateLogoImage(company, "new_logo.jpg");

        // then
        verify(companyImageRepository).save(existingLogoImage);
        assertEquals("new_logo.jpg", existingLogoImage.getImageUrl());
    }

    @DisplayName("프로모션 이미지를 저장한다.")
    @Test
    void savePromotionImages_Success() {
        // given
        List<CompanyImage> promotionImages = Arrays.asList(new CompanyImage(), new CompanyImage());

        // when & then
        service.savePromotionImages(promotionImages);

        verify(companyImageRepository).saveAll(promotionImages);
    }

    @DisplayName("프로모션 이미지를 업데이트한다.")
    @Test
    void updatePromotionImages_Success() {
        // given
        Company company = new Company();
        List<String> newPromotionImageUrls = Arrays.asList("new_promo1.jpg", "new_promo2.jpg");
        List<CompanyImage> existingPromotionImages = Arrays.asList(new CompanyImage(), new CompanyImage());

        when(companyImageRepository.findAllByCompanyAndPurposeOfUse(company, ImagePurposeType.PROMOTION)).thenReturn(existingPromotionImages);

        // when
        service.updatePromotionImages(company, newPromotionImageUrls);

        // then
        verify(companyImageRepository).deleteAll(existingPromotionImages);
        verify(companyImageRepository).saveAll(anyList());
    }
}
