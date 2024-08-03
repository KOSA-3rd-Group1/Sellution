package shop.sellution.server.company.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyImage;
import shop.sellution.server.company.domain.repository.CompanyImageRepository;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.domain.type.ImagePurposeType;
import shop.sellution.server.company.dto.FindCompanyDisplaySettingRes;
import shop.sellution.server.company.dto.SaveCompanyDisplaySettingReq;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.product.S3Service;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

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
        company.setDisplayName("Test Company");

        CompanyImage logoImage = new CompanyImage();
        logoImage.setImageUrl("logo.jpg");
        logoImage.setPurposeOfUse(ImagePurposeType.LOGO);

        CompanyImage promotionImage = new CompanyImage();
        promotionImage.setImageUrl("promo.jpg");
        promotionImage.setPurposeOfUse(ImagePurposeType.PROMOTION);

        List<CompanyImage> companyImages = Arrays.asList(logoImage, promotionImage);

        when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));
        when(companyImageRepository.findAllByCompany(company)).thenReturn(companyImages);

        // when
        FindCompanyDisplaySettingRes response = service.getCompanyDisplaySetting(companyId);

        // then
        assertNotNull(response);
        assertEquals(companyId, response.getCompanyId());
        assertEquals("Test Company", response.getDisplayName());
        assertEquals("logo.jpg", response.getLogoImageUrl());
        assertEquals(1, response.getPromotionImageUrls().size());
        assertEquals("promo.jpg", response.getPromotionImageUrls().get(0));

        verify(companyRepository).findById(companyId);
        verify(companyImageRepository).findAllByCompany(company);
    }

    @DisplayName("회사 디스플레이 설정을 생성한다.")
    @Test
    void createCompanyDisplaySetting_Success() throws IOException {
        // given
        Long companyId = 1L;
        Company company = new Company();
        company.setCompanyId(companyId);

        SaveCompanyDisplaySettingReq requestDTO = new SaveCompanyDisplaySettingReq();
        requestDTO.setCompanyId(companyId);
        requestDTO.setDisplayName("New Company");

        MockMultipartFile logoFile = new MockMultipartFile("logoFile", "logo.jpg", "image/jpeg", "logo content".getBytes());
        MockMultipartFile promotionFile = new MockMultipartFile("promotionFiles", "promo.jpg", "image/jpeg", "promo content".getBytes());

        when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));
        when(s3Service.uploadFile(eq(logoFile), eq(companyId), eq("setting"), eq(ImagePurposeType.LOGO))).thenReturn("uploaded_logo_url");
        when(s3Service.uploadFile(eq(promotionFile), eq(companyId), eq("setting"), eq(ImagePurposeType.PROMOTION))).thenReturn("uploaded_promo_url");

        // when
        service.createCompanyDisplaySetting(requestDTO, logoFile, List.of(promotionFile));

        // then
        verify(companyRepository).save(any(Company.class));
        verify(companyImageRepository).save(argThat(image -> image.getPurposeOfUse() == ImagePurposeType.LOGO));
        verify(companyImageRepository).saveAll(argThat(iterable ->
                StreamSupport.stream(iterable.spliterator(), false).count() == 1
                        && StreamSupport.stream(iterable.spliterator(), false).allMatch(image -> ((CompanyImage)image).getPurposeOfUse() == ImagePurposeType.PROMOTION)
        ));
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
        MockMultipartFile promotionFile = new MockMultipartFile("promotionFiles", "promo.jpg", "image/jpeg", "promo content".getBytes());

        when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));
        when(s3Service.uploadFile(eq(logoFile), eq(companyId), eq("setting"), eq(ImagePurposeType.LOGO))).thenReturn("uploaded_logo_url");
        when(s3Service.uploadFile(eq(promotionFile), eq(companyId), eq("setting"), eq(ImagePurposeType.PROMOTION))).thenReturn("uploaded_promo_url");
        when(companyImageRepository.findByCompanyAndPurposeOfUse(any(Company.class), eq(ImagePurposeType.LOGO))).thenReturn(Optional.empty());
        when(companyImageRepository.findAllByCompanyAndPurposeOfUse(any(Company.class), eq(ImagePurposeType.PROMOTION))).thenReturn(List.of());

        // when
        service.updateCompanyDisplaySetting(requestDTO, logoFile, List.of(promotionFile));

        // then
        verify(companyRepository).save(any(Company.class));
        verify(companyImageRepository).save(argThat(image -> image.getPurposeOfUse() == ImagePurposeType.LOGO));
        verify(companyImageRepository).deleteAll(anyList());
        verify(companyImageRepository).saveAll(argThat(iterable ->
                StreamSupport.stream(iterable.spliterator(), false).count() == 1
                        && StreamSupport.stream(iterable.spliterator(), false).allMatch(image -> ((CompanyImage)image).getPurposeOfUse() == ImagePurposeType.PROMOTION)
        ));
    }

    @DisplayName("존재하지 않는 회사에 대한 요청 시 예외를 던진다.")
    @Test
    void getCompanyDisplaySetting_ThrowsException() {
        // given
        Long nonExistentCompanyId = 999L;
        when(companyRepository.findById(nonExistentCompanyId)).thenReturn(Optional.empty());

        // when & then
        assertThrows(BadRequestException.class, () -> service.getCompanyDisplaySetting(nonExistentCompanyId));
    }

}