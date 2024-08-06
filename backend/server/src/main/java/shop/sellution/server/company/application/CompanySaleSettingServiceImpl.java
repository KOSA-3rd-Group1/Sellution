package shop.sellution.server.company.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.category.domain.CategoryRepository;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.DayOption;
import shop.sellution.server.company.domain.MonthOption;
import shop.sellution.server.company.domain.WeekOption;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.domain.repository.DayOptionRepository;
import shop.sellution.server.company.domain.repository.MonthOptionRepository;
import shop.sellution.server.company.domain.repository.WeekOptionRepository;
import shop.sellution.server.company.domain.type.DayValueType;
import shop.sellution.server.company.domain.type.SellType;
import shop.sellution.server.company.domain.type.SubscriptionType;
import shop.sellution.server.company.dto.FindCompanySaleSettingRes;
import shop.sellution.server.company.dto.FindOptionRes;
import shop.sellution.server.company.dto.SaveCompanySaleSettingReq;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.domain.Product;
import shop.sellution.server.product.domain.ProductRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanySaleSettingServiceImpl implements CompanySaleSettingService {
    private static final Logger logger = LoggerFactory.getLogger(CompanySaleSettingServiceImpl.class);

    private final CompanyRepository companyRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final DayOptionRepository dayOptionRepository;
    private final WeekOptionRepository weekOptionRepository;
    private final MonthOptionRepository monthOptionRepository;

    public CompanySaleSettingServiceImpl(CompanyRepository companyRepository, CategoryRepository categoryRepository, ProductRepository productRepository, DayOptionRepository dayOptionRepository, WeekOptionRepository weekOptionRepository, MonthOptionRepository monthOptionRepository) {
        this.companyRepository = companyRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.dayOptionRepository = dayOptionRepository;
        this.weekOptionRepository = weekOptionRepository;
        this.monthOptionRepository = monthOptionRepository;
    }

    @Override
    public FindCompanySaleSettingRes getCompanySaleSetting(Long companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));
        List<MonthOption> monthOptions = monthOptionRepository.findByCompany(company);
        List<WeekOption> weekOptions = weekOptionRepository.findByCompany(company);
        List<DayOption> dayOptions = dayOptionRepository.findByCompany(company);


        List<FindOptionRes> monthValues = monthOptions.stream()
                .map(FindOptionRes::fromEntity)
                .collect(Collectors.toList());

        List<FindOptionRes> weekValues = weekOptions.stream()
                .map(FindOptionRes::fromEntity)
                .collect(Collectors.toList());

        List<FindOptionRes> dayValues = dayOptions.stream()
                .map(FindOptionRes::fromEntity)
                .collect(Collectors.toList());

        List<Long> categoryIds = null;
        List<Long> productIds = null;

        if (company.getSellType() == SellType.CATEGORY) {
            categoryIds = categoryRepository.findByCompanyAndIsVisible(company, DisplayStatus.Y)
                    .stream()
                    .map(Category::getCategoryId)
                    .collect(Collectors.toList());
        } else if (company.getSellType() == SellType.EACH) {
            productIds = productRepository.findByCompanyAndIsVisible(company, DisplayStatus.Y)
                    .stream()
                    .map(Product::getProductId)
                    .collect(Collectors.toList());
        }

        return FindCompanySaleSettingRes.fromEntity(company, monthValues, weekValues, dayValues, categoryIds, productIds);
    }


    @Override
    @Transactional
    public void createCompanySaleSetting(SaveCompanySaleSettingReq saveCompanySaleSettingReq) {
        validateSubscriptionTypeOptions(saveCompanySaleSettingReq);

        Company company = companyRepository.findById(saveCompanySaleSettingReq.getCompanyId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));
        saveCompanySaleSettingReq.toEntity(company);
        companyRepository.save(company);

        saveOptions(saveCompanySaleSettingReq, company);
        handleSellType(saveCompanySaleSettingReq, company);
    }

    @Override
    @Transactional
    public void updateCompanySaleSetting(SaveCompanySaleSettingReq saveCompanySaleSettingReq) {
        validateSubscriptionTypeOptions(saveCompanySaleSettingReq);
        Company existingCompany = companyRepository.findById(saveCompanySaleSettingReq.getCompanyId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));

        Company updatedCompany = saveCompanySaleSettingReq.toEntity(existingCompany);
        companyRepository.save(updatedCompany);

        updateOptions(saveCompanySaleSettingReq, updatedCompany);
        handleSellType(saveCompanySaleSettingReq, updatedCompany);
    }

    private void validateSubscriptionTypeOptions(SaveCompanySaleSettingReq saveCompanySaleSettingReq) {
        if (SubscriptionType.MONTH.equals(saveCompanySaleSettingReq.getSubscriptionType())) {
            if (isNullOrEmpty(saveCompanySaleSettingReq.getDayOptions()) ||
                    isNullOrEmpty(saveCompanySaleSettingReq.getWeekOptions()) ||
                    isNullOrEmpty(saveCompanySaleSettingReq.getMonthOptions())) {
                throw new BadRequestException(ExceptionCode.INVALID_SUBSCRIPTION_MONTH_OPTIONS);
            }
        } else if (SubscriptionType.COUNT.equals(saveCompanySaleSettingReq.getSubscriptionType())) {
            if (isNullOrEmpty(saveCompanySaleSettingReq.getDayOptions()) ||
                    isNullOrEmpty(saveCompanySaleSettingReq.getWeekOptions())) {
                throw new BadRequestException(ExceptionCode.INVALID_SUBSCRIPTION_COUNT_OPTIONS);
            }
        }
    }

    private boolean isNullOrEmpty(List<?> list) {
        return list == null || list.isEmpty();
    }

    public void saveOptions(SaveCompanySaleSettingReq requestDTO, Company company) {
        if (requestDTO.getSubscriptionType() != null) {
            if (requestDTO.getSubscriptionType().equals(SubscriptionType.MONTH)) {
                logger.info("Saving month options: {}", requestDTO.getMonthOptions());
                List<MonthOption> monthOptions = requestDTO.getMonthOptions().stream()
                        .map(value -> new MonthOption(null,company, value))
                        .collect(Collectors.toList());
                monthOptionRepository.saveAll(monthOptions);
            }

            logger.info("Saving week options: {}", requestDTO.getWeekOptions());
            List<WeekOption> weekOptions = requestDTO.getWeekOptions().stream()
                    .map(value -> new WeekOption(null, company, value))
                    .collect(Collectors.toList());
            weekOptionRepository.saveAll(weekOptions);

            logger.info("Saving day options: {}", requestDTO.getDayOptions());
            List<DayOption> dayOptions = requestDTO.getDayOptions().stream()
                    .map(value -> new DayOption(null, company, DayValueType.valueOf(value)))
                    .collect(Collectors.toList());
            dayOptionRepository.saveAll(dayOptions);
        }
    }

    public void updateOptions(SaveCompanySaleSettingReq requestDTO, Company company) {
        if (requestDTO.getSubscriptionType() != null) {
            if (requestDTO.getSubscriptionType().equals(SubscriptionType.MONTH)) {
                logger.info("Updating month options: {}", requestDTO.getMonthOptions());
                monthOptionRepository.deleteByCompany(company);
                List<MonthOption> monthOptions = requestDTO.getMonthOptions().stream()
                        .map(value -> new MonthOption(null,company, value))
                        .collect(Collectors.toList());
                monthOptionRepository.saveAll(monthOptions);
            }

            logger.info("Updating week options: {}", requestDTO.getWeekOptions());
            weekOptionRepository.deleteByCompany(company);
            List<WeekOption> weekOptions = requestDTO.getWeekOptions().stream()
                    .map(value -> new WeekOption(null, company, value))
                    .collect(Collectors.toList());
            weekOptionRepository.saveAll(weekOptions);

            logger.info("Updating day options: {}", requestDTO.getDayOptions());
            dayOptionRepository.deleteByCompany(company);
            List<DayOption> dayOptions = requestDTO.getDayOptions().stream()
                    .map(value -> new DayOption(null,company, DayValueType.valueOf(value)))
                    .collect(Collectors.toList());
            dayOptionRepository.saveAll(dayOptions);
        }
    }

    public void handleSellType(SaveCompanySaleSettingReq requestDTO, Company company) {
        switch (requestDTO.getSellType()) {
            case ALL:
                List<Product> allProducts = productRepository.findAll();
                allProducts.forEach(product -> product.setIsVisible(DisplayStatus.Y));
                productRepository.saveAll(allProducts);
                break;

            case CATEGORY:
                List<Category> allCategories = categoryRepository.findAll();
                allCategories.forEach(category -> category.setIsVisible(DisplayStatus.N));
                categoryRepository.saveAll(allCategories);

                List<Category> selectedCategories = categoryRepository.findAllById(requestDTO.getCategories());
                selectedCategories.forEach(category -> category.setIsVisible(DisplayStatus.Y));
                categoryRepository.saveAll(selectedCategories);

                productRepository.findAll().forEach(product -> product.setIsVisible(DisplayStatus.N));
                productRepository.saveAll(productRepository.findAll());

                selectedCategories.forEach(category -> {
                    List<Product> categoryProducts = productRepository.findByCategoryCategoryId(category.getCategoryId());
                    categoryProducts.forEach(product -> product.setIsVisible(DisplayStatus.Y));
                    productRepository.saveAll(categoryProducts);
                });
                break;

            case EACH:
                productRepository.findAll().forEach(product -> product.setIsVisible(DisplayStatus.N));
                productRepository.saveAll(productRepository.findAll());

                List<Product> selectedProducts = productRepository.findAllById(requestDTO.getProducts());
                selectedProducts.forEach(product -> product.setIsVisible(DisplayStatus.Y));
                productRepository.saveAll(selectedProducts);

                selectedProducts.forEach(product -> {
                    Category category = categoryRepository.findById(product.getCategory().getCategoryId()).orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_CATEGORY));
                    category.setIsVisible(DisplayStatus.Y);
                    categoryRepository.save(category);
                });
                break;
        }
    }
}
