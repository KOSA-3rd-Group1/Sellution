package shop.sellution.server.client.application;

import jakarta.servlet.http.HttpServletRequest;
import shop.sellution.server.client.domain.Client;
import shop.sellution.server.client.dto.request.ChangeClientPasswordReq;
import shop.sellution.server.client.dto.request.FindClientIdReq;
import shop.sellution.server.client.dto.request.FindClientPasswordReq;
import shop.sellution.server.client.dto.request.SaveClientReq;

public interface ClientService {

    // 고객 등록
    Long saveClient(SaveClientReq request);

    // 고객 아이디 찾기
    String findClientId(FindClientIdReq request);

    // 고객 비밀번호 찾기
    String findClientPassword(FindClientPasswordReq request, HttpServletRequest httpRequest);

    // 고객 비밀번호 변경
    void changeClientPassword(ChangeClientPasswordReq request, HttpServletRequest httpRequest);
}
