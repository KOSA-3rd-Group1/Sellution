package shop.sellution.server.address.domain;

import jakarta.persistence.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.global.type.DisplayStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "address")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id",nullable = false)
    private Customer customer;

    @NotNull
    @Column(length = 255 ,nullable = false)
    private String address;

    @NotNull
    @Column(length = 50,nullable = false)
    private String name;

    @NotNull
    @Column(length = 50,nullable = false)
    private String zipcode;

    @NotNull
    @Column(length = 255,nullable = false)
    private String addressDetail;

    @NotNull
    @Column(length = 50,nullable = false)
    private String phoneNumber;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 1,nullable = false, columnDefinition = "ENUM('N','Y') DEFAULT 'N'")
    private DisplayStatus isDefaultAddress;

    @NotNull
    @Column(length = 255,nullable = false)
    private String addressName;

    @CreatedDate
    @Column(nullable = false,updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Address(Customer customer, String zipcode, String address, String addressDetail,
                   String name, String phoneNumber, DisplayStatus isDefaultAddress, String addressName) {
        this.customer = customer;
        this.zipcode = zipcode;
        this.address = address;
        this.addressDetail = addressDetail;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.isDefaultAddress = isDefaultAddress;
        this.addressName = addressName;
//        this.createdAt = LocalDateTime.now();
    }

    public void update(String zipcode, String streetAddress, String addressDetail,
                       String name, String phoneNumber, DisplayStatus isDefaultAddress,
                       String addressName) {
        this.zipcode = zipcode;
        this.address = streetAddress;
        this.addressDetail = addressDetail;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.isDefaultAddress = isDefaultAddress;
        this.addressName = addressName;
    }


}