package shop.sellution.server.global;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.account.application.AccountService;
import shop.sellution.server.account.dto.request.SaveAccountReq;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.address.domain.AddressRepository;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.category.domain.CategoryRepository;
import shop.sellution.server.company.domain.*;
import shop.sellution.server.company.domain.repository.*;
import shop.sellution.server.company.domain.type.DayValueType;
import shop.sellution.server.company.domain.type.ImagePurposeType;
import shop.sellution.server.company.domain.type.SellType;
import shop.sellution.server.company.domain.type.SubscriptionType;
import shop.sellution.server.contractcompany.application.ContractCompanyService;
import shop.sellution.server.contractcompany.domain.ContractCompany;
import shop.sellution.server.contractcompany.domain.ContractCompanyRepository;
import shop.sellution.server.contractcompany.dto.request.SaveContractCompanyReq;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.customer.domain.type.CustomerType;
import shop.sellution.server.event.application.EventService;
import shop.sellution.server.event.domain.CouponEvent;
import shop.sellution.server.event.domain.EventRepository;
import shop.sellution.server.event.domain.type.EventState;
import shop.sellution.server.event.domain.type.TargetCustomerType;
import shop.sellution.server.event.dto.request.SaveEventReq;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.order.application.OrderCreationService;
import shop.sellution.server.order.domain.type.OrderType;
import shop.sellution.server.order.dto.request.FindOrderedProductSimpleReq;
import shop.sellution.server.order.dto.request.SaveOrderReq;
import shop.sellution.server.product.domain.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Profile("data")
@Component
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DataInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private boolean alreadySetup = false;
    private final Random random = new Random();

    private final CategoryRepository categoryRepository;
    private final CompanyRepository companyRepository;
    private final ContractCompanyRepository contractCompanyRepository;
    private final ProductRepository productRepository;
    private final AccountService accountService;
    private final CustomerRepository customerRepository;
    private final AddressRepository addressRepository;
    private final MonthOptionRepository monthOptionRepository;
    private final WeekOptionRepository weekOptionRepository;
    private final DayOptionRepository dayOptionRepository;
    private final ProductImageRepository productImageRepository;
    private final EventRepository eventRepository;
    private final OrderCreationService orderCreationService;
    private final CompanyImageRepository companyImageRepository;
    private final ContractCompanyService contractCompanyService;
    private final PasswordEncoder passwordEncoder;

    private final EventService eventService;


    private Company 포켓샐러드;

    private Category 데일리샐러드;
    private Category 테이스티샐러드;
    private Category 더미데이터;

    // 단건 상품들
    private List<Product> oneTimeProducts = new ArrayList<>();
    // 정기 상품들
    private List<Product> subProducts = new ArrayList<>();
    // 전체 상품들
    private List<Product> allProducts = new ArrayList<>();

    // 회원들
    private List<Customer> customers = new ArrayList<>();

    // 옵션들
    private List<DayOption> dayOptions = new ArrayList<>();
    private List<WeekOption> weekOptions = new ArrayList<>();
    private List<MonthOption> monthOptions = new ArrayList<>();


    // 데일리 샐러드 상품들
    private Product 닭가슴살샐러드;
    private Product 닭가슴살비엔나샐러드;
    private Product 크래미샐러드;
    private Product 치즈샐러드;
    private Product 불고기샐러드;
    private Product 닭가슴살볼숯불갈비맛샐러드;

    // 테이스티 샐러드 상품들
    private Product 멕시칸타코샐러드;
    private Product 갈릭페퍼로스트닭다리살샐러드;
    private Product 레드칠리로스트닭가슴살샐러드;
    private Product 이탈리안더블햄샐러드;
    private Product 페퍼콘닭가슴살샐러드;
    private Product 바질페스토두부면샐러드;

    //이미지 URL들
    private final Map<String, List<String>> productImageUrls = new HashMap<>();

    private Customer 신규회원;
    private Customer 휴면회원;
    private Customer 일반회원;

    private Long 테스트용공용계좌아이디;

    private Address 공용주소;
    private Address 공용주소2;


    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (alreadySetup) {
            return;
        }

        createCompany();
        createContractCompany();
        createCategory();
        createProduct();
        //createProduct2();
        createProductImages();
        //createProductImages2();
        createCustomer();
        createAccount();
        createAddress();
        createCompanyOptions();
//        createCouponEvent();
        createOrder();


        alreadySetup = true;
    }


    private void createCompany() {
        포켓샐러드 = Company.builder()
                .displayName("Pocket Salad")
                .name("PocketSalad")
                .shopUrl("https://sellution.shop/shopping/PocketSalad/home")
                .isShopVisible(DisplayStatus.Y)
                .isAutoApproved(DisplayStatus.N)
                .isNewMemberEvent(DisplayStatus.N)
                .serviceType(DeliveryType.BOTH)
                .subscriptionType(SubscriptionType.MONTH)
                .minDeliveryCount(5)
                .maxDeliveryCount(30)
                .themeColor("F37021")
                .sellType(SellType.ALL)
                .mainPromotion1Title("한끼, 건강하고 간단하게")
                .mainPromotion1Content("최고의 퀄리티를 위해\n아끼지 않고 가득 담았습니다.")
                .mainPromotion2Title("식단 관리 할 사람!")
                .mainPromotion2Content("너랑!  나랑!")
                .build();
        companyRepository.save(포켓샐러드);

        CompanyImage logo = CompanyImage.builder()
                .company(포켓샐러드)
                .imageUrl("https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/setting/%ED%8F%AC%EC%BA%A3%EC%83%90%EB%9F%AC%EB%93%9C_%EB%A1%9C%EA%B3%A0.png")
                .purposeOfUse(ImagePurposeType.LOGO)
                .build();
        companyImageRepository.save(logo);
        CompanyImage promotion1 = CompanyImage.builder()
                .company(포켓샐러드)
                .imageUrl("https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/setting/%EB%A9%94%EC%9D%B8%ED%94%84%EB%A1%9C%EB%AA%A8%EC%85%98.jfif")
                .purposeOfUse(ImagePurposeType.PROMOTION)
                .build();
        companyImageRepository.save(promotion1);
        CompanyImage promotion2 = CompanyImage.builder()
                .company(포켓샐러드)
                .imageUrl("https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/setting/%EB%A9%94%EC%9D%B8%ED%94%84%EB%A1%9C%EB%AA%A8%EC%85%982.jfif")
                .purposeOfUse(ImagePurposeType.PROMOTION)
                .build();
        companyImageRepository.save(promotion2);
        CompanyImage promotion3 = CompanyImage.builder()
                .company(포켓샐러드)
                .imageUrl("https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/setting/%EB%A9%94%EC%9D%B8%ED%94%84%EB%A1%9C%EB%AA%A8%EC%85%983.jfif")
                .purposeOfUse(ImagePurposeType.PROMOTION)
                .build();
        companyImageRepository.save(promotion3);


    }

    private void createContractCompany() {

        ContractCompany contractCompany = ContractCompany.builder()
                .company(포켓샐러드)
                .contractCompanyName("PocketSalad")
                .businessRegistrationNumber("346-88-00170")
                .contractAuthId("testtest")
                .contractAuthPassword(passwordEncoder.encode("1q2w3e4r!!"))
                .expiresAt(LocalDateTime.now().plusYears(17))
                .build();

        contractCompanyRepository.save(contractCompany);

    }
    private void createCompanyImage() {

    }

    private void createCategory() {
        데일리샐러드 = Category.builder()
                .name("데일리샐러드")
                .company(포켓샐러드)
                .build();
        테이스티샐러드 = Category.builder()
                .name("테이스티샐러드")
                .company(포켓샐러드)
                .build();

        categoryRepository.save(데일리샐러드);
        categoryRepository.save(테이스티샐러드);

        더미데이터 = Category.builder()
                .name("더미데이터")
                .company(포켓샐러드)
                .build();

        categoryRepository.save(더미데이터);
    }

    // 상품 코드 저장을 위한 Set 추가
    private final Set<Long> createdProductCodes = new HashSet<>();


    private void createProduct() {
        // 데일리 샐러드 상품들
        닭가슴살샐러드 = Product.builder()
                .company(포켓샐러드)
                .category(데일리샐러드)
                .code(generateProductCode())
                .name("닭가슴살 샐러드")
                .stock(1000)
                .cost(8300)
                .productInformation("깔끔하고 담백한 닭가슴살과 가볍게 맛있는 갈릭 소이 드레싱, 신선하고 풍성한 채소가 어우러져 가장 깔끔하고 신선한 맛을 느끼실 수 있어요.")
                .deliveryType(DeliveryType.BOTH)
                .isDiscount(DisplayStatus.Y)
                .discountedPrice(calculateDiscountedPrice(8300, 19))
                .discountRate(19)
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();

        productRepository.save(닭가슴살샐러드);
        oneTimeProducts.add(닭가슴살샐러드);
        subProducts.add(닭가슴살샐러드);
        // 상품 코드 저장
        createdProductCodes.add(닭가슴살샐러드.getCode());

        닭가슴살비엔나샐러드 = Product.builder()
                .company(포켓샐러드)
                .category(데일리샐러드)
                .code(generateProductCode())
                .name("닭가슴살 비엔나 샐러드")
                .stock(1000)
                .cost(9000)
                .productInformation("은은한 마늘향의 닭가슴살 소시지, 진한 풍미의 슈레드 치즈, 훈연향 가득한 베이컨은 아삭한 채소와 잘 어우러져요.\n달콤하고 부드러운 허니 마요 드레싱까지 곁들여 달콤 뽀드득 샐러드로 즐겨보세요.")
                .deliveryType(DeliveryType.BOTH)
                .isDiscount(DisplayStatus.Y)
                .discountRate(21)
                .discountedPrice(calculateDiscountedPrice(9000, 21))
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(닭가슴살비엔나샐러드);

        oneTimeProducts.add(닭가슴살비엔나샐러드);
        subProducts.add(닭가슴살비엔나샐러드);
        // 상품 코드 저장
        createdProductCodes.add(닭가슴살비엔나샐러드.getCode());

        크래미샐러드 = Product.builder()
                .company(포켓샐러드)
                .category(데일리샐러드)
                .code(generateProductCode())
                .name("크래미 샐러드")
                .stock(1000)
                .cost(9000)
                .productInformation("바다향 가득한 쫄깃 싱싱 게맛살 크래미에 부드럽고 상큼한 레몬 크림 드레싱을 곁들여 훌륭한 한끼 샐러드가 되었어요. 베스트 샐러드인 크래미 샐러드를 만나보세요.")
                .deliveryType(DeliveryType.BOTH)
                .isDiscount(DisplayStatus.Y)
                .discountRate(23)
                .discountedPrice(calculateDiscountedPrice(9000, 23))
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(크래미샐러드);

        oneTimeProducts.add(크래미샐러드);
        subProducts.add(크래미샐러드);
        // 상품 코드 저장
        createdProductCodes.add(크래미샐러드.getCode());

        치즈샐러드 = Product.builder()
                .company(포켓샐러드)
                .category(데일리샐러드)
                .code(generateProductCode())
                .name("치즈 샐러드")
                .stock(1000)
                .cost(8100)
                .productInformation("깔끔한 풍미의 쫄깃한 스트링 치즈에 달달하고 상큼한 시나몬 레몬 드레싱을 곁들여 훌륭한 한 끼 식사가 되었어요.\n깔끔하게 맛있는 치즈 샐러드 레시피를 즐겨보세요")
                .deliveryType(DeliveryType.BOTH)
                .isDiscount(DisplayStatus.Y)
                .discountRate(20)
                .discountedPrice(calculateDiscountedPrice(8100, 20))
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(치즈샐러드);

        oneTimeProducts.add(치즈샐러드);
        subProducts.add(치즈샐러드);
        // 상품 코드 저장
        createdProductCodes.add(치즈샐러드.getCode());

        불고기샐러드 = Product.builder()
                .company(포켓샐러드)
                .category(데일리샐러드)
                .code(generateProductCode())
                .name("불고기 샐러드")
                .stock(1000)
                .cost(9800)
                .productInformation("담백한 소고기에 매콤한 고추장 베이스의 칠리 고추 드레싱을 곁들여 든든한 한 끼 식사가 되었어요.\n불고기 샐러드 레시피로 색다르게 즐겨보세요")
                .deliveryType(DeliveryType.ONETIME)
                .isDiscount(DisplayStatus.Y)
                .discountRate(19)
                .discountedPrice(calculateDiscountedPrice(9800, 19))
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(불고기샐러드);

        oneTimeProducts.add(불고기샐러드);
        // 상품 코드 저장
        createdProductCodes.add(불고기샐러드.getCode());

        닭가슴살볼숯불갈비맛샐러드 = Product.builder()
                .company(포켓샐러드)
                .category(데일리샐러드)
                .code(generateProductCode())
                .name("닭가슴살볼 숯불갈비맛 샐러드")
                .stock(1000)
                .cost(9000)
                .productInformation("달달한 갈비맛에 은은한 숯불 향을 입힌 닭가슴살볼은 쫄깃 촉촉해요.\n여기에 고소한 참깨 드레싱을 곁들여 단짠단짠 든든한 한 끼 샐러드로 즐겨보세요.")
                .deliveryType(DeliveryType.SUBSCRIPTION)
                .isDiscount(DisplayStatus.Y)
                .discountRate(23)
                .discountedPrice(calculateDiscountedPrice(9000, 23))
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(닭가슴살볼숯불갈비맛샐러드);

        subProducts.add(닭가슴살볼숯불갈비맛샐러드);
        // 상품 코드 저장
        createdProductCodes.add(닭가슴살볼숯불갈비맛샐러드.getCode());

        // 테이스티 샐러드 상품들

        멕시칸타코샐러드 = Product.builder()
                .company(포켓샐러드)
                .category(테이스티샐러드)
                .code(generateProductCode())
                .name("멕시칸 타코 샐러드")
                .stock(1000)
                .cost(10700)
                .productInformation("오랜 시간 정성을 들여 만드는 폴드 포크! 멕시코에서도 특별한 날 맛보는 요리인 폴드포크 샐러드를 만나보세요!")
                .deliveryType(DeliveryType.BOTH)
                .isDiscount(DisplayStatus.Y)
                .discountRate(21)
                .discountedPrice(calculateDiscountedPrice(10700, 21))
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(멕시칸타코샐러드);

        oneTimeProducts.add(멕시칸타코샐러드);
        subProducts.add(멕시칸타코샐러드);
        createdProductCodes.add(멕시칸타코샐러드.getCode());

        갈릭페퍼로스트닭다리살샐러드 = Product.builder()
                .company(포켓샐러드)
                .category(테이스티샐러드)
                .code(generateProductCode())
                .name("갈릭페퍼 로스트 닭다리살 샐러드")
                .stock(1000)
                .cost(11000)
                .productInformation("신선한 잎채소에 가장 고전적인 닭고기 요리인 갈릭페퍼 로스트 닭다리살을 더했어요!\n선명하고 신선한 특제오리엔탈 드레싱이 샐러드의 신선함을 한층 더 올려줄거에요.")
                .deliveryType(DeliveryType.BOTH)
                .isDiscount(DisplayStatus.Y)
                .discountRate(19)
                .discountedPrice(calculateDiscountedPrice(11000, 19))
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(갈릭페퍼로스트닭다리살샐러드);

        oneTimeProducts.add(갈릭페퍼로스트닭다리살샐러드);
        subProducts.add(갈릭페퍼로스트닭다리살샐러드);
        createdProductCodes.add(갈릭페퍼로스트닭다리살샐러드.getCode());

        레드칠리로스트닭가슴살샐러드 = Product.builder()
                .company(포켓샐러드)
                .category(테이스티샐러드)
                .code(generateProductCode())
                .name("레드 칠리 로스트 닭가슴살 샐러드")
                .stock(1000)
                .cost(11000)
                .productInformation("미국의 블랜큰드 치킨 요리에서 착안한 레드 칠리 로스트 닭가슴살 샐러드에요. \n크리미한 참깨 드레싱으로 매콤함과 고소함의 조화를 더했어요.")
                .deliveryType(DeliveryType.BOTH)
                .isDiscount(DisplayStatus.Y)
                .discountRate(19)
                .discountedPrice(calculateDiscountedPrice(11000, 19))
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(레드칠리로스트닭가슴살샐러드);

        oneTimeProducts.add(레드칠리로스트닭가슴살샐러드);
        subProducts.add(레드칠리로스트닭가슴살샐러드);
        createdProductCodes.add(레드칠리로스트닭가슴살샐러드.getCode());

        이탈리안더블햄샐러드 = Product.builder()
                .company(포켓샐러드)
                .category(테이스티샐러드)
                .code(generateProductCode())
                .name("이탈리안 더블 햄샐러드")
                .stock(1000)
                .cost(10200)
                .productInformation("이탈리안 파르마 햄 샐러드를 오마주한 이탈리안 더블 햄 샐러드를 만나보세요!")
                .deliveryType(DeliveryType.BOTH)
                .isDiscount(DisplayStatus.Y)
                .discountRate(20)
                .discountedPrice(calculateDiscountedPrice(10200, 20))
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(이탈리안더블햄샐러드);

        oneTimeProducts.add(이탈리안더블햄샐러드);
        subProducts.add(이탈리안더블햄샐러드);
        createdProductCodes.add(이탈리안더블햄샐러드.getCode());

        페퍼콘닭가슴살샐러드 = Product.builder()
                .company(포켓샐러드)
                .category(테이스티샐러드)
                .code(generateProductCode())
                .name("페퍼콘 닭가슴살 샐러드")
                .stock(1000)
                .cost(11200)
                .productInformation("페퍼콘의 풍미로 더욱 독특한 매력을 풍기는 촉촉한 닭가슴살 샐러드에 달큰 선명한 오리엔탈 드레싱으로 향과 맛을 더했어요.")
                .deliveryType(DeliveryType.ONETIME)
                .isDiscount(DisplayStatus.Y)
                .discountRate(21)
                .discountedPrice(calculateDiscountedPrice(11200 ,21))
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(페퍼콘닭가슴살샐러드);

        oneTimeProducts.add(페퍼콘닭가슴살샐러드);
        createdProductCodes.add(페퍼콘닭가슴살샐러드.getCode());


        바질페스토두부면샐러드 = Product.builder()
                .company(포켓샐러드)
                .category(테이스티샐러드)
                .code(generateProductCode())
                .name("바질 페스토 두부면 샐러드")
                .stock(1000)
                .cost(11600)
                .productInformation("향긋한 특제 바질 페스토 드레싱과 부드러운 두부면이 어우러진 샐러드로 싱그러운 하루를 채워보세요!")
                .deliveryType(DeliveryType.SUBSCRIPTION)
                .isDiscount(DisplayStatus.Y)
                .discountRate(23)
                .discountedPrice(calculateDiscountedPrice(11600, 23))
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(바질페스토두부면샐러드);

        subProducts.add(바질페스토두부면샐러드);
        createdProductCodes.add(바질페스토두부면샐러드.getCode());

        allProducts.addAll(oneTimeProducts);
        allProducts.addAll(subProducts);

        // 중복 제거
        allProducts = new ArrayList<>(new HashSet<>(allProducts));
    }

    private void createProductImages() {
        productImageUrls.put("닭가슴살 샐러드", Arrays.asList(
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/%EB%8B%AD%EA%B0%80%EC%8A%B4%EC%82%B4%EC%83%90%EB%9F%AC%EB%93%9C_1_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/1_2.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/1_3.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/1_4.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/1_1_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/1_1_2.jpg"
        ));
        productImageUrls.put("닭가슴살 비엔나 샐러드", Arrays.asList(
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/%EB%8B%AD%EA%B0%80%EC%8A%B4%EC%82%B4%EB%B9%84%EC%97%94%EB%82%98%EC%83%90%EB%9F%AC%EB%93%9C_2_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/2_2.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/2_3.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/2_4.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/2_1_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/2_2_2.jpg"
        ));
        productImageUrls.put("크래미 샐러드", Arrays.asList(
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/%ED%81%AC%EB%9E%98%EB%AF%B8%EC%83%90%EB%9F%AC%EB%93%9C_3_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/3_2.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/3_3.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/3_4.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/3_1_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/3_1_2.jpg"
        ));
        productImageUrls.put("치즈 샐러드", Arrays.asList(
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/%EC%B9%98%EC%A6%88%EC%83%90%EB%9F%AC%EB%93%9C_4_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/4_2.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/4_3.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/4_4.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/4_1_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/4_1_2.jpg"
        ));
        productImageUrls.put("불고기 샐러드", Arrays.asList(
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/%EB%B6%88%EA%B3%A0%EA%B8%B0%EC%83%90%EB%9F%AC%EB%93%9C_5_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/5_2.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/5_3.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/5_4.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/5_1_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/5_1_2.jpg"
        ));
        productImageUrls.put("닭가슴살볼 숯불갈비맛 샐러드", Arrays.asList(
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/%EB%8B%AD%EA%B0%80%EC%8A%B4%EC%82%B4%EB%B3%BC%EC%88%AF%EB%B6%88%EA%B0%88%EB%B9%84%EB%A7%9B%EC%83%90%EB%9F%AC%EB%93%9C_6_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/6_2.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/6_3.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/6_4.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/6_1_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/6_1_2.jpg"
        ));
        productImageUrls.put("멕시칸 타코 샐러드", Arrays.asList(
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/%EB%A9%95%EC%8B%9C%EC%B9%B8%ED%83%80%EC%BD%94%EC%83%90%EB%9F%AC%EB%93%9C_7_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/7_2.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/7_3.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/7_4.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/7_1_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/7_1_2.jpg"
        ));
        productImageUrls.put("갈릭페퍼 로스트 닭다리살 샐러드", Arrays.asList(
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/%EA%B0%88%EB%A6%AD%ED%8E%98%ED%8D%BC%EB%A1%9C%EC%8A%A4%ED%8A%B8%EB%8B%AD%EB%8B%A4%EB%A6%AC%EC%82%B4%EC%83%90%EB%9F%AC%EB%93%9C_8_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/8_2.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/8_3.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/8_4.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/8_1_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/8_1_2.jpg"
        ));
        productImageUrls.put("레드 칠리 로스트 닭가슴살 샐러드", Arrays.asList(
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/%EB%A0%88%EB%93%9C%EC%B9%A0%EB%A6%AC%EB%A1%9C%EC%8A%A4%ED%8A%B8%EB%8B%AD%EA%B0%80%EC%8A%B4%EC%82%B4%EC%83%90%EB%9F%AC%EB%93%9C_9_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/9_2.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/9_3.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/9_4.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/9_1_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/9_1_2.jpg"
        ));
        productImageUrls.put("이탈리안 더블 햄샐러드", Arrays.asList(
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/%EC%9D%B4%ED%83%88%EB%A6%AC%EC%95%88%EB%8D%94%EB%B8%94%ED%96%84%EC%83%90%EB%9F%AC%EB%93%9C_10_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/10_2.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/10_3.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/10_4.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/10_1_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/10_1_2.jpg"
        ));
        productImageUrls.put("페퍼콘 닭가슴살 샐러드", Arrays.asList(
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/%ED%8E%98%ED%8D%BC%EC%BD%98%EB%8B%AD%EA%B0%80%EC%8A%B4%EC%82%B4%EC%83%90%EB%9F%AC%EB%93%9C_11_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/11_2.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/11_3.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/11_4.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/11_1_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/11_1_2.jpg"
        ));
        productImageUrls.put("바질 페스토 두부면 샐러드", Arrays.asList(
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/%EB%B0%94%EC%A7%88%ED%8E%98%EC%8A%A4%ED%86%A0%EB%91%90%EB%B6%80%EB%A9%B4%EC%83%90%EB%9F%AC%EB%93%9C_12_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/12_2.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/12_3.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/12_4.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/12_1_1.jpg",
                "https://t1-back-s3.s3.ap-northeast-2.amazonaws.com/PocketSalad/product/12_1_2.jpg"
        ));
        log.info("사진들 hashmap size {}",productImageUrls.size());
        log.info("hashmap 내용 {}", productImageUrls.keySet());
        log.info("hashmap 내용 {}", productImageUrls.values());
        log.info("치즈 샐러드 {}",productImageUrls.get("치즈 샐러드").toString())    ;
        for (Product product : allProducts) {
            List<String> imageUrls = productImageUrls.get(product.getName());
           System.out.println(imageUrls.toString());
            for (int i = 0; i <= 5; i++) {
                if (i == 0) {
                    productImageRepository.save(ProductImage.builder()
                            .product(product)
                            .imageUrl(imageUrls.get(i))
                            .purposeOfUse(ProductImageType.THUMBNAIL)
                            .build());
                } else if (i <=3) {
                    productImageRepository.save(ProductImage.builder()
                            .product(product)
                            .imageUrl(imageUrls.get(i))
                            .purposeOfUse(ProductImageType.LIST)
                            .build());
                } else {
                    productImageRepository.save(ProductImage.builder()
                            .product(product)
                            .imageUrl(imageUrls.get(i))
                            .purposeOfUse(ProductImageType.DETAILS)
                            .build());
                }
            }
        }


    }

    //product 더미 2
    private void createProduct2() {
        for (int i = 1; i <= 100; i++) {
            Product product = Product.builder()
                    .company(포켓샐러드)
                    .category(더미데이터)
                    .code(generateProductCode())
                    .name("단건상품 " + i)
                    .stock(1000)
                    .cost(random.nextInt(5000) + 5000)
                    .productInformation("단건상품 " + i + "의 설명입니다.")
                    .deliveryType(DeliveryType.ONETIME)
                    .isDiscount(DisplayStatus.Y)
                    .discountRate(random.nextInt(30) + 10)
                    .discountedPrice(calculateDiscountedPrice(random.nextInt(5000) + 5000, random.nextInt(30) + 10))
                    .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                    .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                    .build();
            productRepository.save(product);
            oneTimeProducts.add(product);
        }
        for (int i = 1; i <= 20; i++) {
            int cost = random.nextInt(5000) + 5000;
            Product product = Product.builder()
                    .company(포켓샐러드)
                    .category(더미데이터)
                    .code(generateProductCode())
                    .name("할인 없는 단건상품 " + i)
                    .stock(1000)
                    .cost(cost)
                    .productInformation("할인 없는 단건상품 " + i + "의 설명입니다.")
                    .deliveryType(DeliveryType.ONETIME)
                    .isDiscount(DisplayStatus.N)
                    .discountRate(0)
                    .discountedPrice(cost)
                    .build();
            productRepository.save(product);
            oneTimeProducts.add(product);
        }
        for (int i = 1; i <= 100; i++) {
            Product product = Product.builder()
                    .company(포켓샐러드)
                    .category(더미데이터)
                    .code(generateProductCode())
                    .name("정기상품 " + i)
                    .stock(1000)
                    .cost(random.nextInt(5000) + 5000)
                    .productInformation("정기상품 " + i + "의 설명입니다.")
                    .deliveryType(DeliveryType.SUBSCRIPTION)
                    .isDiscount(DisplayStatus.Y)
                    .discountRate(random.nextInt(30) + 10)
                    .discountedPrice(calculateDiscountedPrice(random.nextInt(5000) + 5000, random.nextInt(30) + 10))
                    .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                    .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                    .build();
            productRepository.save(product);
            subProducts.add(product);
        }
        for (int i = 1; i <= 30; i++) {
            int cost = random.nextInt(5000) + 5000;
            Product product = Product.builder()
                    .company(포켓샐러드)
                    .category(더미데이터)
                    .code(generateProductCode())
                    .name("할인 없는 정기상품 " + i)
                    .stock(1000)
                    .cost(cost)
                    .productInformation("할인 없는 정기상품 " + i + "의 설명입니다.")
                    .deliveryType(DeliveryType.SUBSCRIPTION)
                    .isDiscount(DisplayStatus.N)
                    .discountRate(0)
                    .discountedPrice(cost)
                    .build();
            productRepository.save(product);
            subProducts.add(product);
        }

        for (int i = 1; i <= 30; i++) {
            int cost = random.nextInt(5000) + 5000;
            Product product = Product.builder()
                    .company(포켓샐러드)
                    .category(더미데이터)
                    .code(generateProductCode())
                    .name("할인 없는 정기상품 " + i)
                    .stock(1000)
                    .cost(cost)
                    .productInformation("할인 없는 정기상품 " + i + "의 설명입니다.")
                    .deliveryType(DeliveryType.SUBSCRIPTION)
                    .isDiscount(DisplayStatus.N)
                    .discountRate(0)
                    .discountedPrice(cost)
                    .build();
            productRepository.save(product);
            subProducts.add(product);
        }

        //품절 상품
        for (int i = 1; i <= 30; i++) {
            Product product = Product.builder()
                    .company(포켓샐러드)
                    .category(더미데이터)
                    .code(generateProductCode())
                    .name("품절상품 " + i)
                    .stock(0)
                    .cost(random.nextInt(5000) + 5000)
                    .productInformation("품절상품 " + i + "의 설명입니다.")
                    .deliveryType(random.nextBoolean() ? DeliveryType.ONETIME : DeliveryType.SUBSCRIPTION)
                    .isDiscount(DisplayStatus.Y)
                    .discountRate(random.nextInt(30) + 10)
                    .discountedPrice(calculateDiscountedPrice(random.nextInt(5000) + 5000, random.nextInt(30) + 10))
                    .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                    .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                    .build();
            productRepository.save(product);
            if (product.getDeliveryType() == DeliveryType.ONETIME) {
                oneTimeProducts.add(product);
            } else {
                subProducts.add(product);
            }
        }

        // 전체 상품들
        allProducts.addAll(oneTimeProducts);
        allProducts.addAll(subProducts);

        // 중복 제거
        allProducts = new ArrayList<>(new HashSet<>(allProducts));
    }


    private void createProductImages2() {
        for (Product product : allProducts) {
            // 이미 이미지가 있는 상품 또는 createProduct로 생성된 상품은 제외
            if (createdProductCodes.contains(product.getCode())) {
                continue;
            }

            List<String> imageUrls = Arrays.asList(
                    "https://picsum.photos/200?random=" + random.nextInt(1000),
                    "https://picsum.photos/200?random=" + random.nextInt(1000),
                    "https://picsum.photos/200?random=" + random.nextInt(1000),
                    "https://picsum.photos/200?random=" + random.nextInt(1000),
                    "https://picsum.photos/200?random=" + random.nextInt(1000),
                    "https://picsum.photos/200?random=" + random.nextInt(1000)
            );

            for (int i = 0; i < imageUrls.size(); i++) {
                ProductImageType type;
                if (i == 0) {
                    type = ProductImageType.THUMBNAIL;
                } else if (i < 4) {
                    type = ProductImageType.LIST;
                } else {
                    type = ProductImageType.DETAILS;
                }
                ProductImage productImage = ProductImage.builder()
                        .product(product)
                        .imageUrl(imageUrls.get(i))
                        .purposeOfUse(type)
                        .build();
                productImageRepository.save(productImage);
            }
        }
    }





    private void createCustomer() {


        신규회원 = Customer.builder()
                .company(포켓샐러드)
                .username("newCustomer")
                .password(passwordEncoder.encode("newCustomer"))
                .name("길재현")
                .phoneNumber("01075985112")
                .type(CustomerType.NEW)
                .build();

        customerRepository.save(신규회원);


        휴면회원 = Customer.builder()
                .company(포켓샐러드)
                .username("dormantCustomer")
                .password(passwordEncoder.encode("dormantCustomer") )
                .name("돌아온샐러드귀신")
                .phoneNumber("01075985112")
                .type(CustomerType.DORMANT)
                .build();

        customerRepository.save(휴면회원);

        일반회원 = Customer.builder()
                .company(포켓샐러드)
                .username("normalCustomer")
                .password(passwordEncoder.encode("normalCustomer") )
                .name("샐러드매니아")
                .phoneNumber("01075985112")
                .type(CustomerType.NORMAL)
                .build();

        customerRepository.save(신규회원);
        customerRepository.save(일반회원);
        customerRepository.save(휴면회원);


        for (int i = 0; i < 31; i++) {
            Customer customer = Customer.builder()
                    .company(포켓샐러드)
                    .username("customer" + i)
                    .password(passwordEncoder.encode("customer" + i) )
                    .name("샐러드매니아" + i)
                    .phoneNumber("01011111111")
                    .type(CustomerType.values()[random.nextInt(OrderType.values().length)])
                    .build();
            customers.add(customer);
            customerRepository.save(customer);
        }
    }

    private void createAccount() {

        테스트용공용계좌아이디 = accountService.saveAccount(일반회원.getId(), SaveAccountReq.builder()
                .accountNumber("42750204039102")
                .bankCode("004")
                .build());


//        for (Customer customer : customers) { // 50명 더미에 같은 계좌[테스트용]
//            accountService.saveAccount(customer.getId(), SaveAccountReq.builder()
//                    .accountNumber("42750204039102")
//                    .bankCode("004")
//                    .build());
//        }
    }

    private void createAddress() {
        공용주소 = Address.builder()
                .customer(일반회원)
                .name("길김이")
                .addressName("집")
                .address("서울특별시 강남구 테헤란로 427")
                .addressDetail("포스코타워 3층")
                .zipcode("06164")
                .phoneNumber("01075985112")
                .isDefaultAddress(DisplayStatus.Y)
                .build();

        addressRepository.save(공용주소);

        공용주소2 = Address.builder()
                .customer(휴면회원)
                .name("길김이")
                .addressName("집")
                .address("서울특별시 강남구 테헤란로 427")
                .addressDetail("포스코타워 3층")
                .zipcode("06164")
                .phoneNumber("01075985112")
                .isDefaultAddress(DisplayStatus.Y)
                .build();

        addressRepository.save(공용주소2);

        for (Customer customer : customers) { // 50명 더미에 같은 주소[테스트용]
            addressRepository.save(Address.builder()
                    .customer(customer)
                    .name("길김이")
                    .addressName("집")
                    .address("서울특별시 강남구 테헤란로 427")
                    .addressDetail("포스코타워 " + random.nextInt(50) + 1 + "층")
                    .zipcode("06164")
                    .phoneNumber("01075985333")
                    .isDefaultAddress(DisplayStatus.Y)
                    .build());
        }
    }

    private void createCompanyOptions() {

        for (int i = 1; i <= 4; i++) { // 3 ~ 12 개월
            MonthOption monthOption = MonthOption.builder()
                    .company(포켓샐러드)
                    .monthValue(i * 3)
                    .build();
            monthOptions.add(monthOption);
            monthOptionRepository.save(monthOption);
        }

        for (int i = 1; i <= 4; i++) { // 1~5주
            WeekOption weekOption = WeekOption.builder()
                    .company(포켓샐러드)
                    .weekValue(i)
                    .build();
            weekOptions.add(weekOption);
            weekOptionRepository.save(weekOption);
        }

        for (DayValueType type : DayValueType.values()) {
            if (type.name().equals("TUE")) continue; // 화요일 제외 월 ~ 금
            DayOption dayOption = DayOption.builder()
                    .company(포켓샐러드)
                    .dayValue(type)
                    .build();
            dayOptions.add(dayOption);
            dayOptionRepository.save(dayOption);
        }
    }


    private void createOrder() {

        for (int i = 0; i < 10; i++) {
            Customer customer = customers.get(random.nextInt(customers.size()));
            OrderType orderType = OrderType.values()[random.nextInt(OrderType.values().length)];

            SaveOrderReq.SaveOrderReqBuilder orderReqBuilder = SaveOrderReq.builder()
                    .companyId(포켓샐러드.getCompanyId())
                    .addressId(공용주소.getId())
                    .accountId(테스트용공용계좌아이디)
                    .orderType(orderType);

            List<Product> eligibleProducts;
            if (orderType == OrderType.ONETIME) {
                eligibleProducts = oneTimeProducts;
            } else {
                eligibleProducts = subProducts;
            }
            List<FindOrderedProductSimpleReq> orderedProducts = new ArrayList<>();
            int numberOfProducts = random.nextInt(8) + 1;
            Set<Product> products = new HashSet<>();
            for (int j = 0; j < numberOfProducts; j++) {
                products.add(eligibleProducts.get(random.nextInt(eligibleProducts.size())));
            }
            for (Product p : products) {
                orderedProducts.add(FindOrderedProductSimpleReq.builder()
                        .productId(p.getProductId())
                        .count(random.nextInt(3) + 1)
                        .discountRate(p.getDiscountRate())
                        .price(p.getCost())
                        .build());
            }
            orderReqBuilder.orderedProducts(orderedProducts);

            if (orderType == OrderType.ONETIME) { // 단건 주문이면
                SaveOrderReq saveOrderReq = orderReqBuilder.deliveryStartDate(LocalDate.now().plusDays(3))
                        .totalDeliveryCount(1)
                        .build();
                orderCreationService.createOrder(customer.getId(), saveOrderReq);
            }

            if (orderType == OrderType.MONTH_SUBSCRIPTION) { // 정기[월] 주문이면 월, 주,요일 옵션 필수
                orderReqBuilder.monthOptionValue(monthOptions.get(random.nextInt(monthOptions.size())).getMonthValue())
                        .weekOptionValue(weekOptions.get(random.nextInt(weekOptions.size())).getWeekValue())
                        .deliveryStartDate(LocalDate.now().plusDays(random.nextInt(14)).with(TemporalAdjusters.next(DayOfWeek.MONDAY)));
            }
            if (orderType == OrderType.COUNT_SUBSCRIPTION) { // 정기[횟수] 주문이면
                int minDeliveryCount = 포켓샐러드.getMinDeliveryCount();
                int maxDeliveryCount = 포켓샐러드.getMaxDeliveryCount();

                orderReqBuilder.weekOptionValue(weekOptions.get(random.nextInt(weekOptions.size())).getWeekValue())
                        .totalDeliveryCount((random.nextInt(maxDeliveryCount - minDeliveryCount + 1) + minDeliveryCount))
                        .deliveryStartDate(LocalDate.now().plusDays(random.nextInt(14)).with(TemporalAdjusters.next(DayOfWeek.MONDAY)));
            }
            int numberOfDayOptions = random.nextInt(dayOptions.size()) + 1;
            List<DayValueType> selectedDayValueType = new ArrayList<>();
            for (int j = 0; j < numberOfDayOptions; j++) {
                DayOption dayOption = dayOptions.get(random.nextInt(dayOptions.size()));
                if (!selectedDayValueType.contains(dayOption.getDayValue())) {
                    selectedDayValueType.add(dayOption.getDayValue());
                }
            }
            orderReqBuilder.dayValueTypeList(selectedDayValueType);
//            orderReqBuilder.eventId(random.nextLong(9)+1); // 이벤트 랜덤지정

            orderCreationService.createOrder(customer.getId(), orderReqBuilder.build());
        }
    }


    private long generateProductCode() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = productRepository.count();
        return Long.parseLong(date + String.format("%06d", count + 1));
    }

    private int calculateDiscountedPrice(int cost, int discountRate) {
        return cost - (cost * discountRate / 100);
    }

    private void createCouponEvent() {
        createDummyEvent("ALL대상 5% 할인 쿠폰", LocalDate.now().plusDays(2), LocalDate.now().plusDays(11), 5, TargetCustomerType.ALL, 100, EventState.UPCOMING, false);
        createDummyEvent("ALL대상 10% 할인 쿠폰", LocalDate.now().plusDays(7), LocalDate.now().plusDays(7), 10, TargetCustomerType.ALL, 100, EventState.UPCOMING, true);
        createDummyEvent("ALL대상 11% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(10), 11, TargetCustomerType.ALL, 2, EventState.ONGOING, false);
        createDummyEvent("ALL대상 12% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(20), 12, TargetCustomerType.ALL, 2, EventState.ONGOING, false);
        createDummyEvent("NEW대상 13% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(30), 13, TargetCustomerType.NEW, 2, EventState.ONGOING, false);
        createDummyEvent("NORMAL대상 14% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(40), 14, TargetCustomerType.NORMAL, 2, EventState.ONGOING, false);
        createDummyEvent("DORMANT대상 15% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(50), 15, TargetCustomerType.DORMANT, 2, EventState.ONGOING, false);
        createDummyEvent("DORMANT대상 15% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(10), 15, TargetCustomerType.DORMANT, 2, EventState.ONGOING, false);
        createDummyEvent("DORMANT대상 15% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(20), 15, TargetCustomerType.DORMANT, 2, EventState.ONGOING, false);
        createDummyEvent("ALL대상 11% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(30), 11, TargetCustomerType.ALL, 2, EventState.ONGOING, false);
        createDummyEvent("ALL대상 15% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(40), 15, TargetCustomerType.ALL, 2, EventState.ONGOING, false);
        createDummyEvent("ALL대상 15% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(50), 15, TargetCustomerType.ALL, 2, EventState.ONGOING, false);
        createDummyEvent("ALL대상 25% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(30), 25, TargetCustomerType.ALL, 2, EventState.ONGOING, false);
        createDummyEvent("ALL대상 35% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(11), 35, TargetCustomerType.ALL, 2, EventState.ONGOING, false);
        createDummyEvent("ALL대상 45% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(12), 45, TargetCustomerType.ALL, 2, EventState.ONGOING, false);
        createDummyEvent("ALL대상 55% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(10), 55, TargetCustomerType.ALL, 2, EventState.ONGOING, false);
        createDummyEvent("ALL대상 65% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(10), 65, TargetCustomerType.ALL, 2, EventState.ONGOING, false);
        createDummyEvent("ALL대상 15% 할인 쿠폰", LocalDate.now().minusDays(5), LocalDate.now().plusDays(10), 15, TargetCustomerType.ALL, 2, EventState.ONGOING, false);
        createDummyEvent("ALL대상 20% 할인 쿠폰", LocalDate.now().minusDays(3), LocalDate.now().plusDays(15), 20, TargetCustomerType.ALL, 50, EventState.ONGOING, true);
        createDummyEvent("NEW대상 25% 할인 쿠폰", LocalDate.now().minusDays(1), LocalDate.now().plusDays(20), 25, TargetCustomerType.NEW, 100, EventState.ONGOING, false);
        createDummyEvent("NORMAL대상 30% 할인 쿠폰", LocalDate.now().minusDays(2), LocalDate.now().plusDays(25), 30, TargetCustomerType.NORMAL, 100, EventState.ONGOING, false);
        createDummyEvent("ALL대상 10% 할인 쿠폰", LocalDate.now().minusDays(25), LocalDate.now().minusDays(1), 10, TargetCustomerType.ALL, 100, EventState.END, true);
        createDummyEvent("ALL대상 20% 할인 쿠폰", LocalDate.now().minusDays(15), LocalDate.now().minusDays(1), 20, TargetCustomerType.ALL, 100, EventState.END, false);
        createDummyEvent("ALL대상 30% 할인 쿠폰", LocalDate.now().minusDays(10), LocalDate.now().minusDays(1), 30, TargetCustomerType.ALL, 100, EventState.END, false);

    }

    private void createDummyEvent(String name, LocalDate startDate, LocalDate endDate, int discountRate, TargetCustomerType targetCustomerType, int totalQuantity, EventState state, boolean isDeleted) {
        SaveEventReq saveEventReq = SaveEventReq.builder()
                .couponName(name)
                .eventStartDate(startDate)
                .eventEndDate(endDate)
                .couponDiscountRate(discountRate)
                .targetCustomerType(targetCustomerType)
                .totalQuantity(totalQuantity)
                .build();

        eventService.createDummyEvent(saveEventReq); //redis 데이터 생성 같이 하기위해서 service 메서드 사용
    }

}
