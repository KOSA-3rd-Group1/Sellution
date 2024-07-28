//package shop.sellution.server.company.application;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import shop.sellution.server.category.domain.Category;
//import shop.sellution.server.category.domain.CategoryRepository;
//import shop.sellution.server.company.domain.Company;
//import shop.sellution.server.company.domain.DayOption;
//import shop.sellution.server.company.domain.MonthOption;
//import shop.sellution.server.company.domain.WeekOption;
//import shop.sellution.server.company.domain.repository.CompanyRepository;
//import shop.sellution.server.company.domain.repository.DayOptionRepository;
//import shop.sellution.server.company.domain.repository.MonthOptionRepository;
//import shop.sellution.server.company.domain.repository.WeekOptionRepository;
//import shop.sellution.server.company.domain.type.DayValueType;
//import shop.sellution.server.company.domain.type.SellType;
//import shop.sellution.server.company.domain.type.SubscriptionType;
//import shop.sellution.server.company.dto.FindCompanySaleSettingRes;
//import shop.sellution.server.company.dto.SaveCompanySaleSettingReq;
//import shop.sellution.server.global.type.DeliveryType;
//import shop.sellution.server.global.type.DisplayStatus;
//import shop.sellution.server.product.domain.Product;
//import shop.sellution.server.product.domain.ProductRepository;
//
//import java.util.List;
//import java.util.Optional;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.anyList;
//import static org.mockito.Mockito.*;
//
//class CompanySaleSettingServiceImplTest {
//
//    @Mock
//    private CompanyRepository companyRepository;
//    @Mock
//    private CategoryRepository categoryRepository;
//    @Mock
//    private ProductRepository productRepository;
//    @Mock
//    private DayOptionRepository dayOptionRepository;
//    @Mock
//    private WeekOptionRepository weekOptionRepository;
//    @Mock
//    private MonthOptionRepository monthOptionRepository;
//
//    @InjectMocks
//    private CompanySaleSettingServiceImpl service;
//
//    private Company company;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//        company = new Company();
//        company.setCompanyId(1L);
//    }
//
//    @DisplayName("회사의 판매 설정을 가져온다")
//    @Test
//    void testGetCompanySaleSetting() {
//        // given
//        List<MonthOption> monthOptions = List.of(new MonthOption(null, company, 1));
//        List<WeekOption> weekOptions = List.of(new WeekOption(null, company, 1));
//        List<DayOption> dayOptions = List.of(new DayOption(null, company, DayValueType.MON));
//
//        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(company));
//        when(monthOptionRepository.findByCompany(any(Company.class))).thenReturn(monthOptions);
//        when(weekOptionRepository.findByCompany(any(Company.class))).thenReturn(weekOptions);
//        when(dayOptionRepository.findByCompany(any(Company.class))).thenReturn(dayOptions);
//
//        // when
//        FindCompanySaleSettingRes result = service.getCompanySaleSetting(1L);
//
//        // then
//        assertThat(result).isNotNull();
//        assertThat(result.getMonthValues()).containsExactly(1);
//        assertThat(result.getWeekValues()).containsExactly(1);
//        assertThat(result.getDayValues()).containsExactly("MON");
//        verify(companyRepository, times(1)).findById(1L);
//    }
//
//    @DisplayName("회사의 판매 설정을 생성한다")
//    @Test
//    void testCreateCompanySaleSetting() {
//        // given
//        SaveCompanySaleSettingReq requestDTO = SaveCompanySaleSettingReq.builder()
//                .companyId(1L)
//                .serviceType(DeliveryType.BOTH)
//                .sellType(SellType.ALL)
//                .subscriptionType(SubscriptionType.MONTH)
//                .minDeliveryCount(5)
//                .maxDeliveryCount(10)
//                .monthOptions(List.of(1, 2, 3))
//                .weekOptions(List.of(1, 2, 3))
//                .dayOptions(List.of("MON", "THU"))
//                .build();
//
//        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(company));
//        when(companyRepository.save(any(Company.class))).thenReturn(company);
//
//        // when
//        service.createCompanySaleSetting(requestDTO);
//
//        // then
//        verify(companyRepository, times(1)).save(any(Company.class));
//        verify(monthOptionRepository, times(1)).saveAll(anyList());
//        verify(weekOptionRepository, times(1)).saveAll(anyList());
//        verify(dayOptionRepository, times(1)).saveAll(anyList());
//    }
//
//    @DisplayName("회사의 판매 설정을 업데이트한다")
//    @Test
//    void testUpdateCompanySaleSetting() {
//        // given
//        SaveCompanySaleSettingReq requestDTO = SaveCompanySaleSettingReq.builder()
//                .companyId(1L)
//                .serviceType(DeliveryType.BOTH)
//                .sellType(SellType.ALL)
//                .subscriptionType(SubscriptionType.MONTH)
//                .minDeliveryCount(5)
//                .maxDeliveryCount(10)
//                .monthOptions(List.of(1, 2, 3))
//                .weekOptions(List.of(1, 2, 3))
//                .dayOptions(List.of("MON", "THU"))
//                .build();
//
//        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(company));
//
//        // when
//        service.updateCompanySaleSetting(requestDTO);
//
//        // then
//        verify(companyRepository, times(1)).save(any(Company.class));
//        verify(monthOptionRepository, times(1)).deleteByCompany(any(Company.class));
//        verify(monthOptionRepository, times(1)).saveAll(anyList());
//        verify(weekOptionRepository, times(1)).deleteByCompany(any(Company.class));
//        verify(weekOptionRepository, times(1)).saveAll(anyList());
//        verify(dayOptionRepository, times(1)).deleteByCompany(any(Company.class));
//        verify(dayOptionRepository, times(1)).saveAll(anyList());
//    }
//
//    @DisplayName("모든 제품의 판매 타입을 설정한다")
//    @Test
//    void testHandleSellTypeAll() {
//        // given
//        SaveCompanySaleSettingReq requestDTO = SaveCompanySaleSettingReq.builder()
//                .sellType(SellType.ALL)
//                .build();
//
//        List<Product> allProducts = List.of(
//                Product.builder().productId(1L).name("Product1").isVisible(DisplayStatus.N).build(),
//                Product.builder().productId(2L).name("Product2").isVisible(DisplayStatus.N).build()
//        );
//
//        when(productRepository.findAll()).thenReturn(allProducts);
//
//        // when
//        service.handleSellType(requestDTO, company);
//
//        // then
//        allProducts.forEach(product -> assertThat(product.getIsVisible()).isEqualTo(DisplayStatus.Y));
//        verify(productRepository, times(1)).saveAll(allProducts);
//    }
//
//    @DisplayName("카테고리별로 판매 타입을 설정한다")
//    @Test
//    void testHandleSellTypeCategory() {
//        // given
//        SaveCompanySaleSettingReq requestDTO = SaveCompanySaleSettingReq.builder()
//                .sellType(SellType.CATEGORY)
//                .categories(List.of(1L, 2L))
//                .build();
//
//        List<Category> allCategories = List.of(
//                Category.builder().categoryId(1L).name("Category1").isVisible(DisplayStatus.N).build(),
//                Category.builder().categoryId(2L).name("Category2").isVisible(DisplayStatus.N).build()
//        );
//
//        List<Category> selectedCategories = List.of(
//                Category.builder().categoryId(1L).name("Category1").isVisible(DisplayStatus.N).build(),
//                Category.builder().categoryId(2L).name("Category2").isVisible(DisplayStatus.N).build()
//        );
//
//        when(categoryRepository.findAll()).thenReturn(allCategories);
//        when(categoryRepository.findAllById(anyList())).thenReturn(selectedCategories);
//
//        // when
//        service.handleSellType(requestDTO, company);
//
//        // then
//        allCategories.forEach(category -> assertThat(category.getIsVisible()).isEqualTo(DisplayStatus.N));
//        selectedCategories.forEach(category -> assertThat(category.getIsVisible()).isEqualTo(DisplayStatus.Y));
//        verify(categoryRepository, times(2)).saveAll(anyList());
//    }
//
//    @DisplayName("개별 제품의 판매 타입을 설정한다")
//    @Test
//    void testHandleSellTypeEach() {
//        // given
//        SaveCompanySaleSettingReq requestDTO = SaveCompanySaleSettingReq.builder()
//                .sellType(SellType.EACH)
//                .products(List.of(1L, 2L))
//                .build();
//
//        Category category1 = Category.builder().categoryId(1L).name("Category1").build();
//        Category category2 = Category.builder().categoryId(2L).name("Category2").build();
//
//        List<Product> allProducts = List.of(
//                Product.builder().productId(1L).name("Product1").isVisible(DisplayStatus.N).category(category1).build(),
//                Product.builder().productId(2L).name("Product2").isVisible(DisplayStatus.N).category(category2).build()
//        );
//
//        List<Product> selectedProducts = List.of(
//                Product.builder().productId(1L).name("Product1").isVisible(DisplayStatus.N).category(category1).build(),
//                Product.builder().productId(2L).name("Product2").isVisible(DisplayStatus.N).category(category2).build()
//        );
//
//        when(productRepository.findAll()).thenReturn(allProducts);
//        when(productRepository.findAllById(anyList())).thenReturn(selectedProducts);
//        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category1));
//        when(categoryRepository.findById(2L)).thenReturn(Optional.of(category2));
//
//        // when
//        service.handleSellType(requestDTO, company);
//
//        // then
//        allProducts.forEach(product -> assertThat(product.getIsVisible()).isEqualTo(DisplayStatus.N));
//        selectedProducts.forEach(product -> assertThat(product.getIsVisible()).isEqualTo(DisplayStatus.Y));
//        verify(productRepository, times(2)).saveAll(anyList());
//        verify(categoryRepository, times(2)).save(any(Category.class));
//    }
//}