package shop.sellution.server.payment.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.global.util.JasyptEncryptionUtil;
import shop.sellution.server.payment.domain.PaymentHistory;
import shop.sellution.server.payment.domain.repository.PaymentHistoryRepository;
import shop.sellution.server.payment.dto.request.FindPaymentHistoryCond;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryDetailRes;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryRes;

@Service
@RequiredArgsConstructor
public class PaymentHistoryServiceImpl implements PaymentHistoryService {

    private final PaymentHistoryRepository paymentHistoryRepository;
    private final JasyptEncryptionUtil jasyptEncryptionUtil;

    @Override
    @Transactional(readOnly = true)
    public Page<FindPaymentHistoryRes> findPaymentHistoryByCompanyId(Long companyId, FindPaymentHistoryCond findPaymentHistoryCond, Pageable pageable) {
        return paymentHistoryRepository.findPaymentHistoryByConditions(companyId, findPaymentHistoryCond, pageable);
    }

    @Override
    public Page<FindPaymentHistoryDetailRes> findPaymentHistoryByOrderId(Long orderId, Pageable pageable) {
        Page<PaymentHistory> page = paymentHistoryRepository.findAllByOrderId(orderId, pageable);
        return page.map((PaymentHistory paymentHistory) -> FindPaymentHistoryDetailRes.fromEntity(paymentHistory, maskAccountNumber(paymentHistory.getAccount().getAccountNumber())));
    }

    public String maskAccountNumber(String accountNumber) {
        String decryptedAccountNumber = jasyptEncryptionUtil.decrypt(accountNumber.substring(0, accountNumber.length() - 4));
        return "*".repeat(decryptedAccountNumber.length()) + accountNumber.substring(accountNumber.length()-4);
    }

}
