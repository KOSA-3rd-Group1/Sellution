package shop.sellution.server.address.dto;


import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.global.type.DisplayStatus;

import java.time.LocalDateTime;

@Getter
@Builder
public class FindAddressReq {

    private Long id;

    private String address;

    private String name;

    private String zipcode;

    private String addressDetail;

    private String phoneNumber;

    private DisplayStatus isDefaultAddress;

    private String addressName;

    private LocalDateTime createdAt;

    FindAddressReq fromEntity(Address address){
        return FindAddressReq.builder()
                .id(address.getId())
                .address(address.getAddress())
                .name(address.getName())
                .zipcode(address.getZipcode())
                .addressDetail(address.getAddressDetail())
                .phoneNumber(address.getPhoneNumber())
                .isDefaultAddress(address.getIsDefaultAddress())
                .addressName(address.getAddressName())
                .createdAt(address.getCreatedAt())
                .build();
    }
}
