package shop.sellution.server.payment.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.payment.dto.request.FindPaymentHistoryCond;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryRes;

public interface PaymentHistoryService {

    Page<FindPaymentHistoryRes> findPaymentHistoryByCompanyId(Long companyId, FindPaymentHistoryCond findPaymentHistoryCond, Pageable pageable);
}
