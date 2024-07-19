package shop.sellution.server.company.application;

import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.dto.FindCompanyUrlSettingRes;
import shop.sellution.server.company.dto.SaveCompanyUrlSettingReq;
import shop.sellution.server.global.type.DisplayStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
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
    }

    @DisplayName("회사 URL 설정을 가져온다.")
    @Test
    void getCompanyUrlSetting_Success() {
        // given
        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(company));

        // when & then
        FindCompanyUrlSettingRes result = service.getCompanyUrlSetting(1L);

        assertThat(result).isNotNull();
        assertThat(result.getCompanyId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("TestCompany");
        assertThat(result.getShopUrl()).isEqualTo("https://www.sellution.com/TestCompany");
        assertThat(result.getIsShopVisible()).isEqualTo("Y");
        verify(companyRepository, times(1)).findById(1L);
    }

    @DisplayName("회사 URL 설정을 업데이트한다.")
    @Test
    void updateCompanyUrlSetting_Success() {
        // given
        SaveCompanyUrlSettingReq requestDTO = SaveCompanyUrlSettingReq.builder()
                .companyId(1L)
                .name("UpdatedCompany")
                .isShopVisible("N")
                .build();

        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(company));

        // when & then
        service.updateCompanyUrlSetting(requestDTO);

        verify(companyRepository, times(1)).save(any(Company.class));
        assertThat(company.getName()).isEqualTo("UpdatedCompany");
        assertThat(company.getShopUrl()).isEqualTo("https://www.sellution.com/UpdatedCompany");
        assertThat(company.getIsShopVisible()).isEqualTo(DisplayStatus.N);
    }
}
