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
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.domain.repository.DayOptionRepository;
import shop.sellution.server.company.domain.repository.MonthOptionRepository;
import shop.sellution.server.company.domain.repository.WeekOptionRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.event.domain.CouponEvent;
import shop.sellution.server.event.domain.EventRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.order.domain.*;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.domain.type.OrderType;
import shop.sellution.server.order.dto.request.FindOrderedProductSimpleReq;
import shop.sellution.server.order.dto.request.SaveOrderReq;
import shop.sellution.server.payment.application.PaymentService;
import shop.sellution.server.payment.dto.request.PaymentReq;
import shop.sellution.server.payment.util.PaymentUtil;
import shop.sellution.server.product.domain.Product;
import shop.sellution.server.product.domain.ProductRepository;
import shop.sellution.server.sms.application.SmsServiceImpl;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
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
    private final PaymentService paymentService;
    private final SmsServiceImpl smsService;
    private final EventRepository eventRepository;


    private static final int ONETIME = 1;


    @Transactional
    public long createOrder(Long customerId, SaveOrderReq saveOrderReq) {
        log.info("주문 생성 시작");

        // 단건주문 생성시 예외처리
        if (saveOrderReq.getOrderType().isOnetime()) {
            if (saveOrderReq.getMonthOptionId() != null || saveOrderReq.getWeekOptionId() != null) {
                throw new BadRequestException(INVALID_ORDER_INFO_FOR_ONETIME);
            }
        }
        // 정기주문[월] 생성시 예외처리
        if (saveOrderReq.getOrderType().isMonthSubscription()) {
            if (saveOrderReq.getMonthOptionId() == null || saveOrderReq.getWeekOptionId() == null) {
                throw new BadRequestException(INVALID_ORDER_INFO_FOR_SUB);
            }
        }
        // 정기주문[횟수] 생성시 예외처리
        if (saveOrderReq.getOrderType().isCountSubscription()) {
            if (saveOrderReq.getWeekOptionId() == null || saveOrderReq.getTotalDeliveryCount() == null) {
                throw new BadRequestException(INVALID_ORDER_INFO_FOR_SUB);
            }
        }


        Company company = companyRepository.findById(saveOrderReq.getCompanyId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_COMPANY_ID));
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));
        Address address = addressRepository.findById(saveOrderReq.getAddressId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ADDRESS));
        Account account = accountRepository.findById(saveOrderReq.getAccountId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ACCOUNT));

        CouponEvent couponEvent=null;
        if(saveOrderReq.getEventId()!=null){
            couponEvent = eventRepository.findById(saveOrderReq.getEventId()).
                    orElseThrow( ()-> new BadRequestException(NOT_FOUND_EVENT) );
        }



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
                .couponEvent(couponEvent)
                .monthOption(monthOption)
                .weekOption(weekOption)
                .code(orderCodeMaker())
                .type(saveOrderReq.getOrderType())
                .status(company.getIsAutoApproved().name().equals("Y")? OrderStatus.APPROVED : OrderStatus.HOLD)
                .perPrice(totalPrice(saveOrderReq.getOrderedProducts(),couponEvent))
                .deliveryStartDate(saveOrderReq.getDeliveryStartDate())
                .deliveryEndDate(deliveryInfo.getDeliveryEndDate())
                .nextDeliveryDate(deliveryInfo.getNextDeliveryDate())
                .totalDeliveryCount(deliveryInfo.getTotalDeliveryCount())
                .remainingDeliveryCount(deliveryInfo.getTotalDeliveryCount())
                .build();
//        order.setNextPaymentDate(getNextPaymentDate(order));
        order.setTotalPrice(order.getPerPrice()*order.getTotalDeliveryCount());
        log.info("생성된 주문 배송시작일: {}", order.getDeliveryStartDate());
        Order savedOrder = orderRepository.save(order);

        // OrderedProduct 엔티티 생성 및 연결
        List<OrderedProduct> orderedProducts = createOrderedProducts(order, products, saveOrderReq.getOrderedProducts());
        order.setOrderedProducts(orderedProducts);

        // SelectedDay 엔티티 생성 및 연결
        List<SelectedDay> selectedDays = createSelectedDays(order, saveOrderReq.getDayOptionIds());
        order.setSelectedDays(selectedDays);

        String orderedProductInfo = orderedProducts.stream()
                .map(orderedProduct -> "   " + orderedProduct.getProduct().getName() + " : " + orderedProduct.getCount() + "개\n")
                .collect(Collectors.joining(""));
        log.info("생성된 주문번호 : {}", order.getId());
        String message =String.format("""
                [Sellution] 주문이 완료되었습니다.
                주문번호
                %d
                주문하신 상품 내역
                %s
                주문하신 상품 총 가격
                %d원
                선택하신 배송 시작일
                %s
                첫번째 배송일자
                %s
                마지막 배송일자
                %s
                총 배송횟수
                %d
                
                주문해주셔서 감사합니다.
                주문이 승인될시 결제가 됩니다.
                """,order.getCode(),orderedProductInfo,order.getPerPrice(),order.getDeliveryStartDate(),order.getNextDeliveryDate(),order.getDeliveryEndDate(),order.getTotalDeliveryCount());
        if(couponEvent!=null){
            message = message + String.format("""
                    
                    적용된 쿠폰 -> [ 쿠폰명 : %s , 할인율 : %d%% ]
                    """,couponEvent.getCouponName(),couponEvent.getCouponDiscountRate());
        }
//        smsService.sendSms(customer.getPhoneNumber(),message);

        if(order.getStatus()==OrderStatus.APPROVED){
            // 자동주문승인으로 인해 바로 승인이 된다면 , 즉시 결제 시도
            String approveMessage = String.format("""
                    [Sellution] 주문이 승인되었습니다. [ 자동 ]
                    승인된 주문번호
                    %d
                    """,order.getCode());
//            smsService.sendSms(customer.getPhoneNumber(),approveMessage);
            paymentService.pay(
                    PaymentReq.builder()
                            .accountId(order.getAccount().getId())
                            .orderId(order.getId())
                            .customerId(order.getCustomer().getId())
                            .build()
            );
        }
        return order.getId();

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

    private List<OrderedProduct> createOrderedProducts(
            Order order,
            List<Product> products,
            List<FindOrderedProductSimpleReq> orderedProducts
    ) {

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
                            .count(orderedProduct.getCount())
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

    public int totalPrice(List<FindOrderedProductSimpleReq> orderedProducts, CouponEvent couponEvent) {
        // 주문한 상품들의 가격을 합쳐서 총 가격을 만들어준다.
        return orderedProducts.stream()
                .mapToInt(product -> {
                    double originProductPrice = product.getPrice();
                    double productPrice = product.getPrice();
                    double productDiscountPrice = 0;
                    double eventDiscountPrice =0;

                    log.info("원래 상품 가격 : {}", originProductPrice);

                    if (product.getDiscountRate() != 0) {
                        productDiscountPrice = originProductPrice * (product.getDiscountRate() / 100.0);
                        productPrice = originProductPrice - productDiscountPrice;
                        log.info("상품 할인율에 의한 할인가 : {} , 할인 후 가격 {}", productDiscountPrice, productPrice);
                    }

                    if (couponEvent != null) {
                        eventDiscountPrice = productPrice * (couponEvent.getCouponDiscountRate() / 100.0);
                        productPrice = productPrice - eventDiscountPrice;
                        log.info("쿠폰 할인율에 의한 할인가 : {}, 할인 후 가격 {}", eventDiscountPrice, productPrice);
                    }


                    return (int) Math.round(productPrice * product.getCount());
                })
                .sum();
    }

    public DeliveryInfo calculateTotalDeliveryCountAndDeliveryEndDate(
            LocalDate deliveryStartDate,
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
            return new DeliveryInfo(ONETIME, deliveryStartDate, deliveryStartDate.plusDays(3)); // 단건주문은 3일 후 배송
        }

        if (weekOption == null || dayOptionIds.isEmpty()) {
            throw new BadRequestException(INVALID_ORDER_TYPE);
        }

        int weekly = weekOption.getWeekValue(); // n 주 마다 배송
        // 선택된 요일값 [월,화,수 ... ]
        List<DayOption> dayOptions = dayOptionRepository.findByIdIn(dayOptionIds);
        List<DayOfWeek> deliveryDays = dayOptions.stream()
                .map((dayOption -> dayOption.getDayValue().changeToDayOfWeek()))
                .sorted()
                .toList();


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

    private DeliveryInfo calculateMonthSubscription(
            LocalDate deliveryStartDate,
            int months,
            int weekly,
            List<DayOfWeek> deliveryDays
    ) {
        // 구독 종료일 계산 (deliveryStartDate 기준)
        LocalDate subscriptionEndDate = deliveryStartDate.plusMonths(months);

//         다음 주 월요일 계산
//        LocalDate nextMonday = deliveryStartDate.with(TemporalAdjusters.next(DayOfWeek.MONDAY));

        return calculateDeliveryInfo(deliveryStartDate, subscriptionEndDate, weekly, deliveryDays,-1);
    }

private DeliveryInfo calculateCountSubscription(
        LocalDate deliveryStartDate,
        int totalDeliveryCount,
        int weekly,
        List<DayOfWeek> deliveryDays
) {
//     1. 다음 주의 월요일을 찾습니다.
//    LocalDate nextMonday = deliveryStartDate.with(TemporalAdjusters.next(DayOfWeek.MONDAY));

    return calculateDeliveryInfo(deliveryStartDate, null, weekly, deliveryDays, totalDeliveryCount);
}

private LocalDate getNextPaymentDate(Order order) {
    if (order.getType().isOnetime() || order.getType().isCountSubscription()) { // 단건주문, 횟수주문에는 다음 결제가없다.
        return null;
    } else  { // 월정기 주문이라면
//        log.info("다음 결제일 : {}",order.getDeliveryStartDate().plusMonths(1).minusDays(7));
        return order.getDeliveryStartDate().plusMonths(1).minusDays(7);
    }
}

    private DeliveryInfo calculateDeliveryInfo(
            LocalDate startDate,
            LocalDate endDate,
            int weekly,
            List<DayOfWeek> deliveryDays,
            int maxDeliveries
    ) {
        Set<DayOfWeek> deliveryDaysSet = EnumSet.copyOf(deliveryDays);
        int deliveryCount = 0;
        LocalDate currentDate = startDate;
        LocalDate nextDeliveryDate = null;
        LocalDate lastDeliveryDate = null;

        while (endDate == null || !currentDate.isAfter(endDate)) {
            if (deliveryDaysSet.contains(currentDate.getDayOfWeek()) &&
                    (ChronoUnit.WEEKS.between(startDate, currentDate) % weekly == 0)) {
                deliveryCount++;
                if (nextDeliveryDate == null) {
                    nextDeliveryDate = currentDate;
                }
                lastDeliveryDate = currentDate;

                if (maxDeliveries > 0 && deliveryCount >= maxDeliveries) { // 정기(횟수)주문의 경우 배송횟수를 초과하면 종료
                    break;
                }
            }
            currentDate = currentDate.plusDays(1);
        }

        return new DeliveryInfo(deliveryCount, lastDeliveryDate, nextDeliveryDate);
    }


    @Getter
    @AllArgsConstructor
    static class DeliveryInfo {
        private int totalDeliveryCount;
        private LocalDate deliveryEndDate;
        private LocalDate nextDeliveryDate;
    }


}



