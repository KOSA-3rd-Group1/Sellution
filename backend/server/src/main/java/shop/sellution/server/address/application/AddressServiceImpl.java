package shop.sellution.server.address.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.address.domain.AddressRepository;
import shop.sellution.server.address.dto.response.FindAddressRes;
import shop.sellution.server.address.dto.response.FindAllAddressRes;
import shop.sellution.server.address.dto.request.SaveAddressReq;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.global.type.DisplayStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {
    private final AddressRepository addressRepository;
    private final CustomerRepository customerRepository;

    public AddressServiceImpl(AddressRepository addressRepository, CustomerRepository customerRepository) {
        this.addressRepository = addressRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public List<FindAllAddressRes> getAddressesByCustomerId(Long customerId) {
        return addressRepository.findByCustomerCustomerId(customerId).stream()
                .map(FindAllAddressRes::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FindAddressRes getAddressById(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        return FindAddressRes.fromEntity(address);
    }


    @Override
    @Transactional
    public void createAddress(SaveAddressReq addressRequestDTO) {
        Customer customer = customerRepository.findById(addressRequestDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (addressRequestDTO.getIsDefaultAddress() == DisplayStatus.Y) {
            addressRepository.resetDefaultAddress(addressRequestDTO.getCustomerId());
        }

        Address address = addressRequestDTO.toEntity(customer);
        addressRepository.save(address);
    }

    @Override
    @Transactional
    public void updateAddress(Long addressId, SaveAddressReq addressRequestDTO) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (addressRequestDTO.getIsDefaultAddress() == DisplayStatus.Y) {
            addressRepository.resetDefaultAddress(addressRequestDTO.getCustomerId());
        }

        addressRequestDTO.updateEntity(address);
        addressRepository.save(address);
    }


    @Override
    @Transactional
    public void deleteAddress(Long addressId) {
        addressRepository.deleteById(addressId);
    }
}
