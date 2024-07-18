package shop.sellution.server.payment.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import shop.sellution.server.payment.domain.repository.PaymentHistoryRepository;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryRes;

@Service
@RequiredArgsConstructor
public class PaymentHistoryServiceImpl implements PaymentHistoryService {

    private final PaymentHistoryRepository paymentHistoryRepository;

    @Override
    public Page<FindPaymentHistoryRes> findPaymentHistoryByCompanyId(Long companyId, Pageable pageable) {
        return paymentHistoryRepository.;
    }
}
