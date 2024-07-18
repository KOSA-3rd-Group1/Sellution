package shop.sellution.server.company.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CompanyRepositoryTest {
    @Mock
    private CompanyRepository companyRepository;

    @DisplayName("name에서 company_id를 추출한다")
    @Test
    void findByName_found() {
        // given
        Company company = new Company();
        company.setName("carrot");
        company.setCompanyId(10L);
        companyRepository.save(company);

        when(companyRepository.findByName("carrot")).thenReturn(Optional.of(company));

        // when
        Optional<Company> foundCompany = companyRepository.findByName("carrot");

        // then
        assertThat(foundCompany).isPresent();
        assertThat(foundCompany.get().getName()).isEqualTo("carrot");
        assertThat(foundCompany.get().getCompanyId()).isEqualTo(10L);
    }

    @DisplayName("name에서 company_id를 찾지 못한다")
    @Test
    void findByName_notFound() {
        // given
        when(companyRepository.findByName("carrotttt")).thenReturn(Optional.empty());

        // when
        Optional<Company> foundCompany = companyRepository.findByName("carrotttt");

        // then (Optional 객체가 비어있는지 검증)
        assertThat(foundCompany).isNotPresent();
    }
}
