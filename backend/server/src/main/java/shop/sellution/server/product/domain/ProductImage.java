package shop.sellution.server.product.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product_image")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_image_id")
    private Long productImageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id",nullable = false)
    private Product product;

    @Column(name = "image_url", length = 255,nullable = false)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose_of_use",nullable = false,columnDefinition = "ENUM('THUMBNAIL','LIST','DETAILS')")
    private ProductImageType purposeOfUse;

}
