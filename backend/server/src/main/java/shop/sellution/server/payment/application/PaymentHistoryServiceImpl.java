package shop.sellution.server.payment.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.payment.domain.repository.PaymentHistoryRepository;
import shop.sellution.server.payment.dto.request.FindPaymentHistoryCond;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryRes;

@Service
@RequiredArgsConstructor
public class PaymentHistoryServiceImpl implements PaymentHistoryService {

    private final PaymentHistoryRepository paymentHistoryRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<FindPaymentHistoryRes> findPaymentHistoryByCompanyId(Long companyId, FindPaymentHistoryCond findPaymentHistoryCond, Pageable pageable) {
        return paymentHistoryRepository.findPaymentHistoryByConditions(companyId, findPaymentHistoryCond, pageable);
    }
}
