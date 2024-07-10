package shop.sellution.server.account.domain.type;

import lombok.Getter;

@Getter
public enum BankCode {

    KB("004","국민은행"),
    KAKAO("090","카카오뱅크"),
    SHINHAN("088","신한은행"),
    WOORI("020","우리은행"),
    IBK("003","기업은행"),
    TOSS("092","토스뱅크"),
    POST("070","우체국은행"),
    NH("011","농협은행"),
    HANA("081","하나은행");

    private final String bankName;
    private final String backCode;

    BankCode(String backCode,String bankName) {
        this.backCode = backCode;
        this.bankName = bankName;
    }
}
