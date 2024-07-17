package shop.sellution.server.address.domain;

import jakarta.persistence.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.global.type.DisplayStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "address")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @NotNull
    @Column(length = 255)
    private String address;

    @NotNull
    @Column(length = 50)
    private String name;

    @NotNull
    @Column(length = 50)
    private String zipcode;

    @NotNull
    @Column(length = 255)
    private String addressDetail;

    @NotNull
    @Column(length = 50)
    private String phoneNumber;

    @NotNull
    @Enumerated(EnumType.STRING)
    private DisplayStatus isDefaultAddress;

    @NotNull
    @Column(length = 255)
    private String addressName;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}