package shop.sellution.server.company.domain.type;

import lombok.Getter;

@Getter
public enum SellType {
    ALL("전체상품"),
    CATEGORY("카테고리"),
    EACH("개별상품");

    private final String description;

    SellType(String description) {
        this.description = description;
    }

}
