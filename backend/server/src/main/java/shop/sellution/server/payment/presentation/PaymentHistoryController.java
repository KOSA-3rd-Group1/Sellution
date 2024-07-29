package shop.sellution.server.payment.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import shop.sellution.server.payment.application.PaymentHistoryService;
import shop.sellution.server.payment.dto.request.FindPaymentHistoryCond;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryDetailRes;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryRes;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payment-histories")
public class PaymentHistoryController {

    private final PaymentHistoryService paymentHistoryService;


    @GetMapping("/company/{companyId}")
    public Page<FindPaymentHistoryRes> findPaymentHistoryByCompanyId(
            @PathVariable Long companyId,
            FindPaymentHistoryCond findPaymentHistoryCond,
            Pageable pageable) {
        return paymentHistoryService.findPaymentHistoryByCompanyId(companyId, findPaymentHistoryCond, pageable);
    }

    @GetMapping("/orders/{orderId}")
    public Page<FindPaymentHistoryDetailRes> findPaymentHistoryByOrderId(
            @PathVariable Long orderId,
            Pageable pageable) {
        return paymentHistoryService.findPaymentHistoryByOrderId(orderId, pageable);
    }


}
