package shop.sellution.server.customer.application;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.customer.dto.CustomerSearchCondition;
import shop.sellution.server.customer.dto.request.*;
import shop.sellution.server.customer.dto.resonse.FindCurrentCustomerInfoRes;
import shop.sellution.server.customer.dto.resonse.FindCustomerInfoRes;
import shop.sellution.server.customer.dto.resonse.FindCustomerRes;

public interface CustomerService {

    // 회원 가입
    Long saveCustomer(SaveCustomerReq request);

    // 회원 아이디 중복 확인
    void checkCustomerUsername(CheckCustomerUsernameReq request);

    // 현재 고객 정보 가져오기
    FindCurrentCustomerInfoRes getCurrentUserInfo();

    // 회원 아이디 찾기
    String findCustomerId(FindCustomerIdReq request);

    // 회원 아이디 찾기 SMS 인증 번호 요청
    void findCustomerIdSmsAuthNumber(FindCustomerIdSmsAuthNumberReq request);

    // 회원 비밀번호 찾기
    String findCustomerPassword(FindCustomerPasswordReq request, HttpServletRequest httpRequest);

    // 회원 비밀번호 찾기 SMS 인증 번호 요청
    void findCustomerPasswordSmsAuthNumber(FindCustomerPasswordSmsAuthNumberReq request);

    // 회원 비밀번호 변경
    void changeCustomerPassword(ChangeCustomerPasswordReq request, HttpServletRequest httpRequest);

    // 회원 필터링 조회
    Page<FindCustomerRes> findAllCustomerByCompanyId(CustomerSearchCondition condition, Pageable pageable);

    // 마이페이지 회원 정보 조회
    FindCustomerInfoRes getCustomerInfo(Long customerId);

    //본인 인증을 위한 메서드
    void sendAuthenticationCode(Long customerId, String name, String phoneNumber);

    //인증번호 검증을 위한 메소드
    void verifyAuthenticationCode(Long customerId, String authCode);
}
