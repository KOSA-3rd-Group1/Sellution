package shop.sellution.server.address.application;

import shop.sellution.server.address.dto.response.FindAddressRes;
import shop.sellution.server.address.dto.response.FindAllAddressRes;
import shop.sellution.server.address.dto.request.SaveAddressReq;

import java.util.List;

public interface AddressService {
    List<FindAllAddressRes> getAddressesByCustomerId(Long customerId);
    FindAddressRes getAddressById(Long addressId);
    Long createAddress(SaveAddressReq addressRequestDTO);
    void updateAddress(Long addressId, SaveAddressReq addressRequestDTO);
    void deleteAddress(Long addressId);
}
