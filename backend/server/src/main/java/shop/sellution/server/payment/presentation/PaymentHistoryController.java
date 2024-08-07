package shop.sellution.server.payment.presentation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.global.util.JasyptEncryptionUtil;
import shop.sellution.server.payment.application.PaymentHistoryService;
import shop.sellution.server.payment.dto.request.FindPaymentHistoryCond;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryDetailRes;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryRes;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/payment-histories")
public class PaymentHistoryController {

    private final PaymentHistoryService paymentHistoryService;


    @GetMapping("/company/{companyId}")
    public Page<FindPaymentHistoryRes> findPaymentHistoryByCompanyId(
            @PathVariable Long companyId,
            FindPaymentHistoryCond findPaymentHistoryCond,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("companyId: {}", companyId);
        log.info("findPaymentHistoryCond: {}", findPaymentHistoryCond);
        return paymentHistoryService.findPaymentHistoryByCompanyId(companyId, findPaymentHistoryCond, pageable);
    }

    @GetMapping("/orders/{orderId}")
    public Page<FindPaymentHistoryDetailRes> findPaymentHistoryByOrderId(
            @PathVariable Long orderId,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return paymentHistoryService.findPaymentHistoryByOrderId(orderId, pageable);
    }




}
