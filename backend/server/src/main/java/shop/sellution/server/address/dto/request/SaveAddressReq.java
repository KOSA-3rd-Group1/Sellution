package shop.sellution.server.address.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.global.annotation.validation.ValidPhoneNumber;
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

    @NotBlank(message = "배송지명은 필수 입니다.")
    private String addressName;
    @NotBlank(message = "수령인은 필수 입니다.")
    private String name;
    @NotBlank(message = "휴대폰번호는 필수 입니다.")
    @ValidPhoneNumber
    private String phoneNumber;
    @NotBlank(message = "우편번호는 필수 입니다.")
    private String zipcode;
    @NotBlank(message = "주소는 필수 입니다.")
    private String streetAddress;
    @NotBlank(message = "상세주소는 필수 입니다.")
    private String addressDetail;

    @NotNull
    private DisplayStatus isDefaultAddress;


    //DTO를 entity로 변환
//    public Address toEntity(Customer customer) {
//        return Address.builder()
//                .customer(customer)
//                .zipcode(zipcode)
//                .address(streetAddress)
//                .addressDetail(addressDetail)
//                .name(name)
//                .phoneNumber(phoneNumber)
//                .isDefaultAddress(isDefaultAddress)
//                .addressName(addressName)
//                .createdAt(LocalDateTime.now())
//                .build();
//    }

//    public void updateEntity(Address address) {
//        address.setZipcode(zipcode);
//        address.setAddress(streetAddress);
//        address.setAddressDetail(addressDetail);
//        address.setName(name);
//        address.setPhoneNumber(phoneNumber);
//        address.setIsDefaultAddress(isDefaultAddress);
//        address.setAddressName(addressName);
//    }


}

