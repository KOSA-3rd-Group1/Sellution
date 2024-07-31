package shop.sellution.server.easypwd.application;

import shop.sellution.server.easypwd.dto.request.EasyPwdReq;

public interface EasyPwdService {

    void registerEasyPwd(Long customerId, EasyPwdReq req);

    void verifyEasyPwd(Long customerId, EasyPwdReq easyPwdReq);

    boolean checkEasyPwd(Long customerId);
}
