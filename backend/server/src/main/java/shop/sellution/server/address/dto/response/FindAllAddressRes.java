package shop.sellution.server.address.dto.response;

import lombok.*;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.global.type.DisplayStatus;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FindAllAddressRes { //배송지 상세보기 했을 때
    private Long addressId;
    private String addressName;
    private DisplayStatus isDefaultAddress;
    private String name;
    private String zipcode;
    private String phoneNumber;
    private String streetAddress;
    private String addressDetail;

    // 엔티티를 DTO로 변환
    public static FindAllAddressRes fromEntity(Address address) {
        return FindAllAddressRes.builder()
                .addressId(address.getId())
                .streetAddress(address.getAddress())
                .addressDetail(address.getAddressDetail())
                .name(address.getName())
                .zipcode(address.getZipcode())
                .phoneNumber(address.getPhoneNumber())
                .isDefaultAddress(address.getIsDefaultAddress())
                .addressName(address.getAddressName())
                .build();
    }
}

