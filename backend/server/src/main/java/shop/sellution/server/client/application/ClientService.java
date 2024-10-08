package shop.sellution.server.client.application;

import jakarta.servlet.http.HttpServletRequest;
import shop.sellution.server.client.dto.request.*;
import shop.sellution.server.client.dto.response.FindCurrentClientInfoRes;

public interface ClientService {

    // 고객 가입
    Long saveClient(SaveClientReq request);

    // 고객 아이디 중복 확인
    void checkClientUsername(CheckClientUsernameReq request);

    // 고객 가입 전 휴대폰 본인 인증 번호 요청
    Boolean checkClientPhoneNumber(CheckClientPhoneNumberReq request);

    // 고객 가입 시 휴대폰 본인 인증 번호 확인
    Boolean verifyClientSmsAuthNumber(FindClientSignupSmsAuthNumberReq request);

    // 현재 고객 이름 가져오기
    FindCurrentClientInfoRes getCurrentUserInfo();

    // 고객 아이디 찾기
    String findClientId(FindClientIdReq request);

    // 고객 아이디 찾기 SMS 인증 번호 요청
    void findClientIdSmsAuthNumber(FindClientIdSmsAuthNumberReq request);

    // 고객 비밀번호 찾기
    String findClientPassword(FindClientPasswordReq request, HttpServletRequest httpRequest);

    // 고객 비밀번호 찾기 SMS 인증 번호 요청
    void findClientPasswordSmsAuthNumber(FindClientPasswordSmsAuthNumberReq request);

    // 고객 비밀번호 변경
    void changeClientPassword(ChangeClientPasswordReq request, HttpServletRequest httpRequest);

}
