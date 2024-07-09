package shop.sellution.server.product.domain;

public enum ProductImageType {
    THUMBNAIL("상품 썸네일 이미지"),
    LIST("상품이미지"),
    DETAILS("상품설명용도");

    private final String description;

    ProductImageType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
