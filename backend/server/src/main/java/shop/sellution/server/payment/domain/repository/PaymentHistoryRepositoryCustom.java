package shop.sellution.server.payment.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.payment.dto.request.FindPaymentHistoryCond;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryRes;


public interface PaymentHistoryRepositoryCustom {

    Page<FindPaymentHistoryRes> findPaymentHistoryByConditions(
            Long customerId,
            FindPaymentHistoryCond findPaymentHistoryCond,
            Pageable pageable
    );
}
