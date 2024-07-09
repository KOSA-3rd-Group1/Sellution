package shop.sellution.server.company.domain.type;

public enum ImagePurposeType {
    PROMOTION("메인 페이지 사진"),
    LOGO("로고 사진");

    private final String description;

    ImagePurposeType(String description) {
        this.description = description;
    }

    public String getDescription(){
        return description;
    }
}
