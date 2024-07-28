package shop.sellution.server.account.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.account.dto.request.SaveAccountReq;
import shop.sellution.server.account.dto.request.UpdateAccountReq;
import shop.sellution.server.account.dto.response.FindAccountDetailRes;
import shop.sellution.server.account.dto.response.FindAccountRes;

public interface AccountService {

    Page<FindAccountRes> findAllAccountsByCustomerId(Long customerId, Pageable pageable);

    Long saveAccount(Long customerId,SaveAccountReq saveAccountReq);

    void updateAccount(Long accountId, UpdateAccountReq updateAccountReq);

    void deleteAccount(Long accountId);

    FindAccountDetailRes findAccount(Long accountId);

}
