package shop.sellution.server.client.application;

import shop.sellution.server.client.domain.Client;
import shop.sellution.server.client.dto.request.FindClientIdReq;
import shop.sellution.server.client.dto.request.SaveClientReq;

public interface ClientService {

    // 고객 등록
    Long saveClient(SaveClientReq request);

    // 고객 아이디 찾기
    String findClientId(FindClientIdReq request);
}
