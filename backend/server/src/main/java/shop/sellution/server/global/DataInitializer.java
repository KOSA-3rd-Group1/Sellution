package shop.sellution.server.global;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.account.domain.AccountRepository;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.address.domain.AddressRepository;
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
import shop.sellution.server.contractcompany.domain.ContractCompany;
import shop.sellution.server.contractcompany.domain.ContractCompanyRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.customer.domain.type.CustomerType;
import shop.sellution.server.event.domain.CouponEvent;
import shop.sellution.server.event.domain.EventRepository;
import shop.sellution.server.event.domain.type.EventState;
import shop.sellution.server.event.domain.type.TargetCustomerType;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.order.application.OrderCreationService;
import shop.sellution.server.order.application.OrderService;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.order.domain.type.OrderType;
import shop.sellution.server.order.dto.request.FindOrderedProductSimpleReq;
import shop.sellution.server.order.dto.request.SaveOrderReq;
import shop.sellution.server.product.domain.Product;
import shop.sellution.server.product.domain.ProductRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Profile("data")
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private final CategoryRepository categoryRepository;
    private boolean alreadySetup = false;
    private final Random random = new Random();
    private final CompanyRepository companyRepository;
    private final ContractCompanyRepository contractCompanyRepository;
    private final ProductRepository productRepository;
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final AddressRepository addressRepository;
    private final MonthOptionRepository monthOptionRepository;
    private final WeekOptionRepository weekOptionRepository;
    private final DayOptionRepository dayOptionRepository;
    private final EventRepository eventRepository;

    private final OrderCreationService orderCreationService;


    private Company 포켓샐러드;

    private Category 데일리샐러드;
    private Category 테이스티샐러드;

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

    private Customer 신규회원;
    private Customer 휴면회원;
    private Customer 일반회원;

    private Account 테스트용공용계좌;
    private Account 테스트용공용계좌2;

    private Address 공용주소;
    private Address 공용주소2;

    private Order 승인전단건주문;
    private Order 승인전정기주문;

    private MonthOption 삼개월;
    private MonthOption 육개월;
    private MonthOption 구개월;
    private MonthOption 십이개월;

    private WeekOption 일주;
    private WeekOption 이주;
    private WeekOption 삼주;
    private WeekOption 사주;
    private WeekOption 오주;

    private DayOption 월;
    private DayOption 수;
    private DayOption 목;
    private DayOption 금;


    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (alreadySetup) {
            return;
        }

        createCompany();
        createContractCompany();
        createCategory();
        createProduct();
        createCustomer();
        createAccount();
        createAddress();
        createCompanyOptions();
        createOrder();

        createCouponEvent();


        alreadySetup = true;
    }


    private void createCompany() {
        포켓샐러드 = Company.builder()
                .displayName("Pocket Salad")
                .name("PocketSalad")
                .shopUrl("https://sellution/shopping/pocketsalad")
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
    }

    private void createContractCompany() {
        ContractCompany contractCompany = ContractCompany.builder()
                .company(포켓샐러드)
                .contractCompanyName("PocketSalad")
                .contractAuthId("PocketSalad-Auth001")
                .contractAuthPassword("sellution1234")
                .businessRegistrationNumber("346-88-00170")
                .expiresAt(LocalDateTime.now().plusYears(1))
                .build();

        contractCompanyRepository.save(contractCompany);
    }

    private void createCompanyImage() {

    }

    private void createCategory() {
        데일리샐러드 = Category.builder()
                .name("데일리샐러드")
                .build();
        테이스티샐러드 = Category.builder()
                .name("테이스티샐러드")
                .build();

        categoryRepository.save(데일리샐러드);
        categoryRepository.save(테이스티샐러드);
    }


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
                .discountRate(19)
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(닭가슴살샐러드);

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
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(닭가슴살비엔나샐러드);

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
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(크래미샐러드);

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
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(치즈샐러드);

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
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(불고기샐러드);

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
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(닭가슴살볼숯불갈비맛샐러드);

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
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(멕시칸타코샐러드);

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
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(갈릭페퍼로스트닭다리살샐러드);


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
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(레드칠리로스트닭가슴살샐러드);

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
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(이탈리안더블햄샐러드);

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
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(페퍼콘닭가슴살샐러드);

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
                .discountStartDate(LocalDateTime.now().minusDays(random.nextInt(20) + 1))
                .discountEndDate(LocalDateTime.now().plusDays(random.nextInt(40) + 1))
                .build();
        productRepository.save(바질페스토두부면샐러드);


    }

    private void createCustomer() {

        신규회원 = Customer.builder()
                .company(포켓샐러드)
                .username("newCustomer")
                .password("newCustomer")
                .name("샐러드뉴비")
                .phoneNumber("010-7598-5112")
                .build();

        customerRepository.save(신규회원);


        휴면회원 = Customer.builder()
                .company(포켓샐러드)
                .username("dormantCustomer")
                .password("dormantCustomer")
                .name("돌아온샐러드귀신")
                .phoneNumber("010-7598-5112")
                .type(CustomerType.DORMANT)
                .build();

        customerRepository.save(휴면회원);

        일반회원 = Customer.builder()
                .company(포켓샐러드)
                .username("normalCustomer")
                .password("normalCustomer")
                .name("샐러드매니아")
                .phoneNumber("010-7598-5112")
                .type(CustomerType.NORMAL)
                .build();

        customerRepository.save(일반회원);
    }

    private void createAccount() {
        테스트용공용계좌 = Account.builder()
                .customer(일반회원)
                .accountNumber("42750204039102")
                .bankCode("004")
                .build();

        accountRepository.save(테스트용공용계좌);

        테스트용공용계좌2 = Account.builder()
                .customer(휴면회원)
                .accountNumber("110555920510")
                .bankCode("088")
                .build();

        accountRepository.save(테스트용공용계좌2);
    }

    private void createAddress() {
        공용주소 = Address.builder()
                .customer(일반회원)
                .name("집")
                .addressName("집")
                .address("서울특별시 강남구 테헤란로 427")
                .addressDetail("포스코타워 3층")
                .zipcode("06164")
                .phoneNumber("010-7598-5112")
                .isDefaultAddress(DisplayStatus.Y)
                .build();

        addressRepository.save(공용주소);

        공용주소2 = Address.builder()
                .customer(휴면회원)
                .name("집")
                .addressName("집")
                .address("서울특별시 강남구 테헤란로 427")
                .addressDetail("포스코타워 3층")
                .zipcode("06164")
                .phoneNumber("010-7598-5112")
                .isDefaultAddress(DisplayStatus.Y)
                .build();

        addressRepository.save(공용주소2);
    }

    private void createCompanyOptions() {

        삼개월 = MonthOption.builder()
                .company(포켓샐러드)
                .monthValue(3)
                .build();
        육개월 = MonthOption.builder()
                .company(포켓샐러드)
                .monthValue(6)
                .build();

        구개월 = MonthOption.builder()
                .company(포켓샐러드)
                .monthValue(9)
                .build();
        십이개월 = MonthOption.builder()
                .company(포켓샐러드)
                .monthValue(12)
                .build();

        monthOptionRepository.save(삼개월);
        monthOptionRepository.save(육개월);
        monthOptionRepository.save(구개월);
        monthOptionRepository.save(십이개월);


        일주 = WeekOption.builder()
                .company(포켓샐러드)
                .weekValue(1)
                .build();

        이주 = WeekOption.builder()
                .company(포켓샐러드)
                .weekValue(2)
                .build();

        삼주 = WeekOption.builder()
                .company(포켓샐러드)
                .weekValue(3)
                .build();

        사주 = WeekOption.builder()
                .company(포켓샐러드)
                .weekValue(4)
                .build();

        오주 = WeekOption.builder()
                .company(포켓샐러드)
                .weekValue(5)
                .build();

        weekOptionRepository.save(일주);
        weekOptionRepository.save(이주);
        weekOptionRepository.save(삼주);
        weekOptionRepository.save(사주);
        weekOptionRepository.save(오주);

        월 = DayOption.builder()
                .company(포켓샐러드)
                .dayValue(DayValueType.MON)
                .build();

        수 = DayOption.builder()
                .company(포켓샐러드)
                .dayValue(DayValueType.WED)
                .build();

        목 = DayOption.builder()
                .company(포켓샐러드)
                .dayValue(DayValueType.THU)
                .build();

        금 = DayOption.builder()
                .company(포켓샐러드)
                .dayValue(DayValueType.FRI)
                .build();

        dayOptionRepository.save(월);
        dayOptionRepository.save(수);
        dayOptionRepository.save(목);
        dayOptionRepository.save(금);
    }


    private void createOrder() {

        // 승인전 단건 주문 생성
        orderCreationService.createOrder(일반회원.getId(),
                SaveOrderReq.builder()
                        .companyId(포켓샐러드.getCompanyId())
                        .addressId(공용주소.getId())
                        .accountId(테스트용공용계좌.getId())
                        .monthOptionId(삼개월.getId())
                        .weekOptionId(일주.getId())
                        .orderType(OrderType.ONETIME)
                        .deliveryStartDate(LocalDateTime.now().plusDays(3))
                        .orderedProducts(List.of(
                                FindOrderedProductSimpleReq.builder()
                                        .productId(닭가슴살샐러드.getProductId())
                                        .count(1)
                                        .discountRate(닭가슴살샐러드.getDiscountRate())
                                        .price(닭가슴살샐러드.getCost())
                                        .build()
                                , FindOrderedProductSimpleReq.builder()
                                        .productId(크래미샐러드.getProductId())
                                        .count(3)
                                        .discountRate(크래미샐러드.getDiscountRate())
                                        .price(크래미샐러드.getCost())
                                        .build(),
                                FindOrderedProductSimpleReq.builder()
                                        .productId(레드칠리로스트닭가슴살샐러드.getProductId())
                                        .count(3)
                                        .discountRate(레드칠리로스트닭가슴살샐러드.getDiscountRate())
                                        .price(레드칠리로스트닭가슴살샐러드.getCost())
                                        .build()
                        ))
                        .dayOptionIds(List.of(월.getId(), 수.getId(), 목.getId(), 금.getId()))
                        .build());


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
        // 기간이 지난 이벤트 2개
        CouponEvent pastEvent1 = CouponEvent.builder()
                .company(포켓샐러드)
                .couponName("Past Event 1")
                .couponDiscountRate(5)
                .targetCustomerType(TargetCustomerType.ALL)
                .eventStartDate(LocalDate.now().minusDays(30))
                .eventEndDate(LocalDate.now().minusDays(10))
                .state(EventState.END)
                .isDeleted(false)
                .build();

        CouponEvent pastEvent2 = CouponEvent.builder()
                .company(포켓샐러드)
                .couponName("Past Event 2")
                .couponDiscountRate(10)
                .targetCustomerType(TargetCustomerType.ALL)
                .eventStartDate(LocalDate.now().minusDays(20))
                .eventEndDate(LocalDate.now().minusDays(5))
                .state(EventState.END)
                .isDeleted(false)
                .build();

        // 진행 중인 이벤트 4개
        CouponEvent ongoingEvent1 = CouponEvent.builder()
                .company(포켓샐러드)
                .couponName("Ongoing Event 1")
                .couponDiscountRate(15)
                .targetCustomerType(TargetCustomerType.ALL)
                .eventStartDate(LocalDate.now().minusDays(5))
                .eventEndDate(LocalDate.now().plusDays(10))
                .state(EventState.ONGOING)
                .isDeleted(false)
                .build();

        CouponEvent ongoingEvent2 = CouponEvent.builder()
                .company(포켓샐러드)
                .couponName("Ongoing Event 2")
                .couponDiscountRate(20)
                .targetCustomerType(TargetCustomerType.ALL)
                .eventStartDate(LocalDate.now().minusDays(3))
                .eventEndDate(LocalDate.now().plusDays(15))
                .state(EventState.ONGOING)
                .isDeleted(true)
                .build();

        CouponEvent ongoingEvent3 = CouponEvent.builder()
                .company(포켓샐러드)
                .couponName("Ongoing Event 3")
                .couponDiscountRate(25)
                .targetCustomerType(TargetCustomerType.NEW)
                .eventStartDate(LocalDate.now().minusDays(1))
                .eventEndDate(LocalDate.now().plusDays(20))
                .state(EventState.ONGOING)
                .isDeleted(false)
                .build();

        CouponEvent ongoingEvent4 = CouponEvent.builder()
                .company(포켓샐러드)
                .couponName("Ongoing Event 4")
                .couponDiscountRate(30)
                .targetCustomerType(TargetCustomerType.NORMAL)
                .eventStartDate(LocalDate.now().minusDays(2))
                .eventEndDate(LocalDate.now().plusDays(25))
                .state(EventState.ONGOING)
                .isDeleted(false)
                .build();

        // 끝난 이벤트 3개
        CouponEvent endedEvent1 = CouponEvent.builder()
                .company(포켓샐러드)
                .couponName("Ended Event 1")
                .couponDiscountRate(10)
                .targetCustomerType(TargetCustomerType.ALL)
                .eventStartDate(LocalDate.now().minusDays(25))
                .eventEndDate(LocalDate.now().minusDays(1))
                .state(EventState.END)
                .isDeleted(false)
                .build();

        CouponEvent endedEvent2 = CouponEvent.builder()
                .company(포켓샐러드)
                .couponName("Ended Event 2")
                .couponDiscountRate(20)
                .targetCustomerType(TargetCustomerType.ALL)
                .eventStartDate(LocalDate.now().minusDays(15))
                .eventEndDate(LocalDate.now().minusDays(1))
                .state(EventState.END)
                .isDeleted(false)
                .build();

        CouponEvent endedEvent3 = CouponEvent.builder()
                .company(포켓샐러드)
                .couponName("Ended Event 3")
                .couponDiscountRate(30)
                .targetCustomerType(TargetCustomerType.ALL)
                .eventStartDate(LocalDate.now().minusDays(10))
                .eventEndDate(LocalDate.now().minusDays(1))
                .state(EventState.END)
                .isDeleted(false)
                .build();

        eventRepository.save(pastEvent1);
        eventRepository.save(pastEvent2);
        eventRepository.save(ongoingEvent1);
        eventRepository.save(ongoingEvent2);
        eventRepository.save(ongoingEvent3);
        eventRepository.save(ongoingEvent4);
        eventRepository.save(endedEvent1);
        eventRepository.save(endedEvent2);
        eventRepository.save(endedEvent3);
    }

}
