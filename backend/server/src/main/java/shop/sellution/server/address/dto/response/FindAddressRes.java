package shop.sellution.server.address.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.global.type.DisplayStatus;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FindAddressRes { //회원의 모든 배송지 목록을 보여줄때
    private Long customerId;
    private String addressName;
    private String name;
    private String phoneNumber;
    private String zipcode;
    private String streetAddress;
    private String addressDetail;
    private DisplayStatus isDefaultAddress;

    // 엔티티를 DTO로 변환
    public static FindAddressRes fromEntity(Address address) {
        return FindAddressRes.builder()
                .customerId(address.getCustomer().getId())
                .addressName(address.getAddressName())
                .name(address.getName())
                .phoneNumber(address.getPhoneNumber())
                .zipcode(address.getZipcode())
                .streetAddress(address.getAddress())
                .addressDetail(address.getAddressDetail())
                .isDefaultAddress(address.getIsDefaultAddress())
                .build();
    }
}
