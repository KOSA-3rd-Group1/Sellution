package shop.sellution.server.auth.application;

public interface RefreshTokenService {

    //refreshToken 저장
    void saveRefreshToken(Long userId, Long companyId, String userRole, String refreshToken);

    //refreshToken 조회
    String getRefreshToken(Long userId, Long companyId, String userRole);

    //refreshToken 삭제
    void deleteRefreshToken(Long userId, Long companyId, String userRole);

    //refreshToken 유효성 검사
    boolean validateRefreshToken(Long userId, Long companyId, String userRole, String refreshToken);

    //키 생성
    String generateKey(Long userId, Long companyId, String userRole);
}

