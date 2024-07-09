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

    @Column(nullable = false)
    private String name;

    @Column(name = "product_count", nullable = false)
    @Builder.Default
    private int productCount = 0 ;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_visible", nullable = false)
    @Builder.Default
    private DisplayStatus isVisible = DisplayStatus.Y;

}
