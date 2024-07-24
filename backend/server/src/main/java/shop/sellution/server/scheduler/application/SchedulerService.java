//package shop.sellution.server.scheduler.application;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import shop.sellution.server.customer.domain.CustomerRepository;
//import shop.sellution.server.global.exception.BadRequestException;
//import shop.sellution.server.order.domain.Order;
//import shop.sellution.server.order.domain.repository.OrderRepository;
//import shop.sellution.server.order.domain.type.DeliveryStatus;
//import shop.sellution.server.order.domain.type.OrderStatus;
//import shop.sellution.server.payment.application.PaymentService;
//import shop.sellution.server.payment.domain.PaymentHistory;
//import shop.sellution.server.payment.domain.repository.PaymentHistoryRepository;
//import shop.sellution.server.payment.domain.type.PaymentStatus;
//import shop.sellution.server.payment.dto.request.PaymentReq;
//
//import java.time.DayOfWeek;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.time.temporal.TemporalAdjusters;
//import java.util.List;
//
//import static shop.sellution.server.global.exception.ExceptionCode.*;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//public class SchedulerService {
//
//    private final OrderRepository orderRepository;
//    private final PaymentHistoryRepository paymentHistoryRepository;
//    private final PaymentService paymentService;
//    private final CustomerRepository customerRepository;
//
//    // 정기결제가 진행된 주문건수
//    private static int paymentCount;
//    // 정기배송이 진행된 주문건수
//    private static int deliveryCount;
//
//
//    // 정기 결제 및 정기 배송 - 임시로 1분 마다 진행
////    @Scheduled(cron = "0 0/1 * * * *")
//    @Transactional
//    public void regularProcess() {
//        log.info("*************** 스케줄러 시작 *************** ");
//        paymentCount = 0;
//        deliveryCount = 0;
//
//        LocalDate now = LocalDate.now();
//        // 승인된 주문이고, 배송상태가 배송전,배송중 인 주문들만 가져온다.
//        orderRepository.findOrdersForRegularPayment()
//                .forEach(order -> {
//                    // 다음 배송일 계산
//                    LocalDate nextDeliveryDate = calculateNextDeliveryDate(order, false);
//                    // 다음 배송일이 있고, 다음 배송일기준으로 오늘이 다음배송일 하루전, 2일전인 주문에 대해 정기결제 로직 수행
//                    if (nextDeliveryDate != null && (now.isEqual(nextDeliveryDate.minusDays(1)) || now.isEqual(nextDeliveryDate.minusDays(2)))) {
//                        // 해당 배송주기에 대해 이미 결제한 내역이 없는 주문만 정기결제 [ 다음배송일 하루전 또는 2일전에 결제성공한 기록이 없으면 결제시작 ]
//                        PaymentHistory paymentHistory = paymentHistoryRepository.findAlreadyHasPaymentHistory(order.getId(), nextDeliveryDate.minusDays(2).atStartOfDay());
//                        if (paymentHistory == null) {
//                            log.info("-------------------스케줄러 정기 결제 시작 --------------------");
//                            log.info("정기결제 대상 주문 정보 - 주문 아이디 {}, 주문 상태 {}, 주문 배송상태 {} ", order.getId(), order.getStatus(), order.getDeliveryStatus());
//                            paymentService.pay(
//                                    PaymentReq.builder()
//                                            .accountId(order.getAccount().getId())
//                                            .orderId(order.getId())
//                                            .customerId(order.getAccount().getId())
//                                            .build()
//                            );
//
//                            // 결제된 건수 증가
//                            paymentCount++;
//                            log.info("-------------------스케줄러 정기 결제 성공 --------------------");
//                        }
//                    }
//                    // ----------------- 위에는 정기결제 아래는 정기배송 로직  -----------------------
//
//                    // 오늘이 배송일인 주문에 대해 배송처리
//                    if (nextDeliveryDate != null && now.isEqual(nextDeliveryDate)) {
//                        // 해당 주문이 현재 배송에 대해 결제가 되어있는지 확인한다. [ 해당 주문의 가장 최근 결제내역을 확인해서 결제완료된 상태인지 확인한다. ]
//                        // 해당 주문이 승인상태인지 확인한다.
//                        PaymentHistory paymentHistory = paymentHistoryRepository.findFirstByOrderIdOrderByCreatedAtDesc(order.getId());
//                        if (paymentHistory != null && paymentHistory.getStatus() == PaymentStatus.COMPLETE && order.getStatus() == OrderStatus.APPROVED) {
//                            // 재고가 남아있는지 확인
//                            order.getOrderedProducts().forEach(orderedProduct -> {
//                                log.info("재고남았는지 확인 -> 상품 아이디 : {}, 상품 재고 : {}, 주문 수량 : {}", orderedProduct.getProduct().getProductId(), orderedProduct.getProduct().getStock(), orderedProduct.getCount());
//                                if (orderedProduct.getProduct().getStock() < orderedProduct.getCount()) {
//                                    throw new BadRequestException(NOT_ENOUGH_STOCK);
//                                }
//                            });
//
//                            log.info("-------------------스케줄러 정기 배송 시작 --------------------");
//                            log.info("정기배송 대상 주문 정보 - 주문 아이디 {}, 주문 상태 {}, 주문 배송상태 {}\n오늘 날짜 {} , 정기 배송날짜 {}\n남은 배송횟수 {}, 전체 배송횟수 {}", order.getId(), order.getStatus(), order.getDeliveryStatus(), LocalDate.now(), order.getNextDeliveryDate(), order.getRemainingDeliveryCount(), order.getTotalDeliveryCount());
//
//                            // 남은 배송횟수 감소
//                            order.decreaseRemainingDeliveryCount();
//                            log.info("남은 배송횟수 감소 후 : {}", order.getRemainingDeliveryCount());
//
//                            // 배송 상태를 배송중으로 변경
//                            order.changeDeliveryStatus(DeliveryStatus.IN_PROGRESS);
//
//                            // 남은 배송횟수가 0이면 배송완료처리
//                            if (order.getRemainingDeliveryCount() == 0) {
//                                order.completeDelivery();
//                            }
//                            log.info("배송 후 배송 상태 : {}", order.getDeliveryStatus());
//
//                            // 주문의 상품재고 감소
//                            order.decreaseProductStock();
//                            log.info("회원의 최신 배송일자 갱신전 : {}", order.getCustomer().getLatestDeliveryDate());
//                            // 회원의 최신 배송일자 갱신
//                            order.getCustomer().updateLatestDeliveryDate(LocalDateTime.now());
//                            log.info("회원의 최신 배송일자 갱신후 : {}", order.getCustomer().getLatestDeliveryDate());
//
//                            // 배송된 건수 증가
//                            deliveryCount++;
//
//                            log.info("다음 배송일 갱신 전 : {}", order.getNextDeliveryDate());
//                            // 그 다음 배송일로 갱신
//                            calculateNextDeliveryDate(order, true);
//                            log.info("다음 배송일 갱신 후 : {}", order.getNextDeliveryDate());
//
//                            log.info("-------------------스케줄러 정기 배송 성공 --------------------");
//
//                        }
//                    }
//                });
//
//        // 최신 배송일자가 오늘보다 60일 이상 차이나는 회원은 휴면회원으로 변경
//        int updatedCount = customerRepository.updateDormantCustomerType(LocalDateTime.now().minusDays(60));
//
//        log.info("-------------------스케줄러 요약 --------------------");
//        log.info("휴면회원 처리된 회원수 : {}", updatedCount);
//        log.info("결제된 건수 : {}", paymentCount);
//        log.info("배송된 건수 : {}", deliveryCount);
//
//        log.info("*************** 스케줄러 종료 *************** ");
//    }
//
//
//    // 가장 가까운 배송일자 계산
//    public LocalDate calculateNextDeliveryDate(Order order, boolean isNextDeliveryDateAfterNow) {
//        // 단건주문인 경우
//        if (order.getType().isOnetime()) {
//            return LocalDate.from(order.getDeliveryEndDate());
//        }
//
//        // 선택된 요일값 [월,화,수 ... ]
//        List<DayOfWeek> deliveryDays = order.getSelectedDays().stream()
//                .map((sd) -> sd.getDayOption().getDayValue().changeToDayOfWeek())
//                .sorted()
//                .toList();
//
//        // 선택된 배송 시작일
//        LocalDate startDate = LocalDate.from(order.getDeliveryStartDate());
//        // 가장 가까운 배송일
//        LocalDate nextDeliveryDate = null;
//
//
//        // 정기주문 [ 월 단위 ] 인 경우
//        if (order.getType().isMonthSubscription()) {
//            // 선택된 n 개월 동안
//            int selectedMonth = order.getMonthOption().getMonthValue();
//            LocalDate subscriptionEndDate = startDate.plusMonths(selectedMonth); // 구독 기간 [ 정기 배송 기간 ]
//            nextDeliveryDate = subscriptionEndDate; // 최소비교할거기때문에 큰값을 넣어둔다.
//            LocalDate currentDate = startDate;
//
//            // 선택된 배송 요일에 대해 반복문을 돌아서 가장 가까운 배송일을 찾는다.
//            for (DayOfWeek day : deliveryDays) {
//                currentDate = startDate.with(TemporalAdjusters.nextOrSame(day));
//                if (currentDate.isBefore(subscriptionEndDate) || currentDate.isEqual(subscriptionEndDate)) { // 그 날짜가 구독기간 내에 있으면
//                    // 다음 배송일 갱신
//                    if (currentDate != startDate) { // 배송당일이 아닌 그 다음 배송일자를 구해야한다.
//
//                    }
//                    order.updateNextDeliveryDate(nextDeliveryDate);
//                    return nextDeliveryDate;
//                }
//            }
//            // 구독기간안에 가장 가까운 배송일이 없다는것은 더이상 배송할일 없다는것이므로 주문을 배송완료처리한다.
//            order.completeDelivery();
//            // 다음 배송일이 없으므로 null을 리턴
//            return null;
//
//        } else { // 정기주문 [횟수 단위] 인 경우
//
//            // 선택된 배송 요일에 대해 반복문을 돌아서 가장 가까운 배송일을 찾는다.
//            for (DayOfWeek day : deliveryDays) {
//                nextDeliveryDate = startDate.with(TemporalAdjusters.nextOrSame(day));
//                // 다음 배송일 갱신
//                if (isNextDeliveryDateAfterNow) continue; // 두번째로 가까운 배송일을 찾는다. -> 정기배송 후 다음 배송일을 찾기위해
//                order.updateNextDeliveryDate(nextDeliveryDate);
//                return nextDeliveryDate;
//            }
//
//        }
//
//        throw new BadRequestException(INTERNAL_SEVER_ERROR);
//    }
//
//
//}
