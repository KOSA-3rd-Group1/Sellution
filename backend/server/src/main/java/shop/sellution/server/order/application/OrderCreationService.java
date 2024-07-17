package shop.sellution.server.order.application;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.account.domain.AccountRepository;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.address.domain.AddressRepository;
import shop.sellution.server.company.domain.*;
import shop.sellution.server.company.domain.repository.DayOptionRepository;
import shop.sellution.server.company.domain.repository.MonthOptionRepository;
import shop.sellution.server.company.domain.repository.WeekOptionRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.order.domain.*;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.domain.type.OrderType;
import shop.sellution.server.order.dto.request.FindOrderedProductSimpleReq;
import shop.sellution.server.order.dto.request.SaveOrderReq;
import shop.sellution.server.product.domain.Product;
import shop.sellution.server.product.domain.ProductRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

import static shop.sellution.server.global.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderCreationService {

    private final CustomerRepository customerRepository;
    private final CompanyRepository companyRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final MonthOptionRepository monthOptionRepository;
    private final WeekOptionRepository weekOptionRepository;
    private final OrderRepository orderRepository;
    private final DayOptionRepository dayOptionRepository;
    private final AccountRepository accountRepository;

    private static final int ONETIME = 1;


    @Transactional
    public void createOrder(Long customerId, SaveOrderReq saveOrderReq) {
        log.info("주문 생성 시작");
        Company company = companyRepository.findById(saveOrderReq.getCompanyId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_COMPANY_ID));
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));
        Address address = addressRepository.findById(saveOrderReq.getAddressId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ADDRESS));

        Account account = accountRepository.findById(saveOrderReq.getAccountId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ACCOUNT));

        MonthOption monthOption = null;
        WeekOption weekOption = null;


        if (saveOrderReq.getMonthOptionId() != null) {
            monthOption = monthOptionRepository.findById(saveOrderReq.getMonthOptionId())
                    .orElseThrow(() -> new BadRequestException(NOT_FOUND_MONTH_OPTION));
        }
        if (saveOrderReq.getWeekOptionId() != null) {
            weekOption = weekOptionRepository.findById(saveOrderReq.getWeekOptionId())
                    .orElseThrow(() -> new BadRequestException(NOT_FOUND_WEEK_OPTION));
        }


        DeliveryInfo deliveryInfo = calculateTotalDeliveryCountAndDeliveryEndDate(
                saveOrderReq.getDeliveryStartDate(),
                saveOrderReq.getOrderType(),
                monthOption,
                weekOption,
                saveOrderReq.getDayOptionIds(),
                saveOrderReq.getTotalDeliveryCount()
        );

        List<Product> products = productRepository.findByProductIdIn(
                saveOrderReq.getOrderedProducts().stream()
                        .map(FindOrderedProductSimpleReq::getProductId)
                        .collect(Collectors.toList())
        );
        Order order = Order.builder()
                .company(company)
                .customer(customer)
                .account(account)
                .address(address)
                .monthOption(monthOption)
                .weekOption(weekOption)
                .code(orderCodeMaker())
                .type(saveOrderReq.getOrderType())
                .status(company.getIsAutoApproved().equals("Y") ? OrderStatus.APPROVED : OrderStatus.HOLD)
                .totalPrice(totalPrice(saveOrderReq.getOrderedProducts()))
                .deliveryStartDate(saveOrderReq.getDeliveryStartDate())
                .deliveryEndDate(deliveryInfo.getDeliveryEndDate())
                .totalDeliveryCount(deliveryInfo.getTotalDeliveryCount())
                .remainingDeliveryCount(deliveryInfo.getTotalDeliveryCount())
                .build();

        Order savedOrder = orderRepository.save(order);

        // OrderedProduct 엔티티 생성 및 연결
        List<OrderedProduct> orderedProducts = createOrderedProducts(order, products, saveOrderReq.getOrderedProducts());
        order.setOrderedProducts(orderedProducts);

        // SelectedDay 엔티티 생성 및 연결
        List<SelectedDay> selectedDays = createSelectedDays(order, saveOrderReq.getDayOptionIds());
        order.setSelectedDays(selectedDays);

        log.info("생성된 주문 : {}", order.getId());

    }

    private List<SelectedDay> createSelectedDays(Order order, List<Long> dayOptionIds) {
        List<DayOption> dayOptions = dayOptionRepository.findByIdIn(dayOptionIds);
        return dayOptions.stream()
                .map(dayOption -> {
                    return SelectedDay.builder()
                            .id(new SelectedDayId(order.getId(), dayOption.getId()))
                            .dayOption(dayOption)
                            .order(order)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<OrderedProduct> createOrderedProducts(Order
                                                               order, List<Product> products, List<FindOrderedProductSimpleReq> orderedProducts) {
        return orderedProducts.stream()
                .map(orderedProduct -> {
                    Product product = products.stream()
                            .filter(p -> p.getProductId().equals(orderedProduct.getProductId()))
                            .findFirst()
                            .orElseThrow(() -> new BadRequestException(NOT_FOUND_PRODUCT));
                    return OrderedProduct.builder()
                            .id(new OrderedProductId(product.getProductId(), order.getId()))
                            .order(order)
                            .product(product)
                            .price(product.getCost())
                            .discountRate(product.getDiscountRate())
                            .build();
                })
                .collect(Collectors.toList());

    }

    public Long orderCodeMaker() {
        // 오늘날짜 + 현재 DB에 들어가있는 orderID중 가장 큰값을 합쳐서 코드를 만들어준다.
        LocalDate localDate = LocalDate.now();
        Long maxOrderId = orderRepository.findMaxOrderId();
        maxOrderId = (maxOrderId == null) ? 1L : maxOrderId + 1;
        String orderCode = localDate.format(DateTimeFormatter.BASIC_ISO_DATE) + String.format("%06d", maxOrderId);
        return Long.parseLong(orderCode);
    }

    public int totalPrice(List<FindOrderedProductSimpleReq> orderedProducts) {
        // 주문한 상품들의 가격을 합쳐서 총 가격을 만들어준다.
        return orderedProducts.stream()
                .mapToInt(product -> {
                    double discountedPrice = product.getPrice() * (100 - product.getDiscountRate()) / 100.0;
                    return (int) Math.round(discountedPrice); // 반올림 적용
                })
                .sum();
    }

    public DeliveryInfo calculateTotalDeliveryCountAndDeliveryEndDate(
            LocalDateTime deliveryStartDate,
            OrderType orderType,
            MonthOption monthOption,
            WeekOption weekOption,
            List<Long> dayOptionIds,
            Integer totalDeliveryCount
    ) {


        if (deliveryStartDate == null || orderType == null) {
            throw new BadRequestException(INVALID_ORDER_TYPE);
        }

        if (orderType.isOnetime()) {
            return new DeliveryInfo(ONETIME, deliveryStartDate);
        }

        if (weekOption == null || dayOptionIds.isEmpty()) {
            throw new BadRequestException(INVALID_ORDER_TYPE);
        }

        int weekly = weekOption.getWeekValue(); // n 주 마다 배송
        List<DayOption> dayOptions = dayOptionRepository.findByIdIn(dayOptionIds);
        List<DayOfWeek> deliveryDays = dayOptions.stream()
                .map((dayOption -> dayOption.getDayValue().changeToDayOfWeek()))
                .sorted()
                .toList();// 요일값


        if (orderType.isMonthSubscription()) {
            if (monthOption == null) {
                throw new BadRequestException(INVALID_ORDER_TYPE);
            }
            return calculateMonthSubscription(deliveryStartDate, monthOption.getMonthValue(), weekly, deliveryDays);
        }

        if (orderType.isCountSubscription()) {
            if (totalDeliveryCount <= 0) {
                throw new BadRequestException(INVALID_ORDER_TYPE);
            }
            return calculateCountSubscription(deliveryStartDate, totalDeliveryCount, weekly, deliveryDays);
        }
        throw new BadRequestException(INVALID_ORDER_TYPE);
    }

    private DeliveryInfo calculateMonthSubscription(LocalDateTime startDate, int months, int weekly, List<
            DayOfWeek> deliveryDays) {
        LocalDateTime endDate = startDate.plusMonths(months); // 구독 기간 [ 정기 배송 기간 ]
        int totalDeliveries = 0;
        LocalDateTime currentDate = startDate;
        LocalDateTime lastDeliveryDate = null;

        // 구독 기간 동안 반복
        while (currentDate.isBefore(endDate)) {
            // 선택된 배송 요일마다 처리
            for (DayOfWeek day : deliveryDays) {
                // 현재 currentDate 이후에 내가 선택한 요일이 나오는 날짜 찾기  [다음 배송 날짜 계산]
                LocalDateTime potentialDeliveryDate = currentDate.with(TemporalAdjusters.nextOrSame(day));
                if (potentialDeliveryDate.isBefore(endDate)) { // 그 날짜가 구독기간 내에 있으면
                    totalDeliveries++; // 총 배송 횟수 증가
                    lastDeliveryDate = potentialDeliveryDate; // 마지막 배송 날짜 갱신
                }
            }
            currentDate = currentDate.plusWeeks(weekly); // n주 뒤로 이동 [ n 주 마다 배송 이니까 ]
        }

        return new DeliveryInfo(totalDeliveries, lastDeliveryDate);
    }

    private DeliveryInfo calculateCountSubscription(LocalDateTime startDate, int totalDeliveryCount,
                                                    int weekly, List<DayOfWeek> deliveryDays) {
        int deliveries = 0;
        LocalDateTime currentDate = startDate;
        LocalDateTime lastDeliveryDate = null;

        // 지정된 배송 횟수에 도달할 때까지 반복
        while (deliveries < totalDeliveryCount) {
            // 선택된 배송 요일마다 처리
            for (DayOfWeek day : deliveryDays) {
                if (deliveries >= totalDeliveryCount) break; // 지정된 배송 횟수에 도달하면 종료
                LocalDateTime deliveryDate = currentDate.with(TemporalAdjusters.nextOrSame(day)); // 다음 배송 날짜 계산
                deliveries++; // 총 배송 횟수 증가
                lastDeliveryDate = deliveryDate; // 마지막 배송 날짜 갱신
            }
            currentDate = currentDate.plusWeeks(weekly); // n주 뒤로 이동 [ n 주 마다 배송 이니까 ]
        }

        return new DeliveryInfo(totalDeliveryCount, lastDeliveryDate);
    }

    @Getter
    @AllArgsConstructor
    static class DeliveryInfo {
        private int totalDeliveryCount;
        private LocalDateTime deliveryEndDate;
    }


}



