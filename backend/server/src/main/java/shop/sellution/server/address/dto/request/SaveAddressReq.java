package shop.sellution.server.address.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.global.type.DisplayStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SaveAddressReq {
    //private Long addressId;
    @NotNull
    private Long customerId;

    @NotBlank
    private String addressName;
    @NotBlank
    private String name;
    @NotBlank
    private String phoneNumber;

    @NotBlank
    private String zipcode;
    @NotBlank
    private String streetAddress;
    @NotBlank
    private String addressDetail;

    @NotNull
    private DisplayStatus isDefaultAddress;


    //DTO를 entity로 변환
    public Address toEntity(Customer customer) {
        return Address.builder()
                .customer(customer)
                .zipcode(zipcode)
                .address(streetAddress)
                .addressDetail(addressDetail)
                .name(name)
                .phoneNumber(phoneNumber)
                .isDefaultAddress(isDefaultAddress)
                .addressName(addressName)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public void updateEntity(Address address) {
        address.setZipcode(zipcode);
        address.setAddress(streetAddress);
        address.setAddressDetail(addressDetail);
        address.setName(name);
        address.setPhoneNumber(phoneNumber);
        address.setIsDefaultAddress(isDefaultAddress);
        address.setAddressName(addressName);
    }


}

