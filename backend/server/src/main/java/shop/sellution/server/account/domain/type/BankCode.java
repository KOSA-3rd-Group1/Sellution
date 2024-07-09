package shop.sellution.server.account.domain.type;


public enum BankCode {
    KB("국민은행"),
    KAKAO("카카오뱅크"),
    SHINHAN("신한은행"),
    WOORI("우리은행"),
    IBK("기업은행"),
    TOSS("토스뱅크"),
    POST("우체국은행"),
    NH("농협은행"),
    HANA("하나은행");

    private String bankName;
    BankCode(String bankName) {}
}
