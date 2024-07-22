package shop.sellution.server.category.domain;


import jakarta.persistence.*;
import lombok.*;
import shop.sellution.server.global.type.DisplayStatus;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(length = 50,nullable = false )
    private String name;

    @Column(name = "product_count", nullable = false, columnDefinition = "int default 0")
    @Builder.Default
    private int productCount = 0 ;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_visible",length = 1, nullable = false, columnDefinition = "ENUM('N','Y') DEFAULT 'Y'")
    @Builder.Default
    private DisplayStatus isVisible = DisplayStatus.Y;

}
