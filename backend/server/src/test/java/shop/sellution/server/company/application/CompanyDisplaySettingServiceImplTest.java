package shop.sellution.server.company.application;

import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyImage;
import shop.sellution.server.company.domain.repository.CompanyImageRepository;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.domain.type.ImagePurposeType;
import shop.sellution.server.company.dto.FindCompanyDisplaySettingRes;
import shop.sellution.server.company.dto.SaveCompanyDisplaySettingReq;
import shop.sellution.server.company.application.CompanyDisplaySettingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

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
    void updateCompanyDisplaySetting_Success() {
        // given
        Long companyId = 1L;
        Company company = new Company();
        company.setCompanyId(companyId);

        SaveCompanyDisplaySettingReq requestDTO = new SaveCompanyDisplaySettingReq();
        requestDTO.setCompanyId(companyId);
        requestDTO.setDisplayName("Updated Company");
        requestDTO.setLogoImageUrl("new_logo.jpg");
        requestDTO.setPromotionImageUrls(Arrays.asList("new_promo1.jpg", "new_promo2.jpg"));

        CompanyImage logoImage = new CompanyImage();
        CompanyImage promoImage1 = new CompanyImage();
        CompanyImage promoImage2 = new CompanyImage();

        when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));
        when(companyImageRepository.findByCompanyAndPurposeOfUse(company, ImagePurposeType.LOGO)).thenReturn(Optional.of(logoImage));
        when(companyImageRepository.findAllByCompanyAndPurposeOfUse(company, ImagePurposeType.PROMOTION)).thenReturn(Arrays.asList(promoImage1, promoImage2));

        // when
        service.updateCompanyDisplaySetting(requestDTO);

        // then
        verify(companyRepository).save(any(Company.class));
        verify(companyImageRepository).save(any(CompanyImage.class));
        verify(companyImageRepository).deleteAll(anyList()); // 이 부분 추가
        verify(companyImageRepository).saveAll(anyList());
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

        // when & then
        service.updateLogoImage(company, newLogoImage);

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
        List<CompanyImage> newPromotionImages = Arrays.asList(new CompanyImage(), new CompanyImage());
        List<CompanyImage> existingPromotionImages = Arrays.asList(new CompanyImage(), new CompanyImage());

        when(companyImageRepository.findAllByCompanyAndPurposeOfUse(company, ImagePurposeType.PROMOTION)).thenReturn(existingPromotionImages);

        // when & then
        service.updatePromotionImages(company, newPromotionImages);

        verify(companyImageRepository).deleteAll(existingPromotionImages);
        verify(companyImageRepository).saveAll(newPromotionImages);
    }
}
