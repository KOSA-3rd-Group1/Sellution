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
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
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
    @Transactional(readOnly = true)
    public List<FindAllAddressRes> getAddressesByCustomerId(Long customerId) {
        //고객 존재 확인
        if(!customerRepository.existsById(customerId)){
            throw new BadRequestException(ExceptionCode.NOT_FOUND_CUSTOMER);
        }
        return addressRepository.findByCustomer_Id(customerId).stream()
                .map(FindAllAddressRes::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FindAddressRes getAddressById(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_ADDRESS));
        return FindAddressRes.fromEntity(address);
    }


    @Override
    @Transactional
    public void createAddress(SaveAddressReq saveAddressReq) {
        Customer customer = customerRepository.findById(saveAddressReq.getCustomerId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_CUSTOMER_FOR_ADDRESS));

        if (saveAddressReq.getIsDefaultAddress() == DisplayStatus.Y) {
            resetDefaultAddress(saveAddressReq.getCustomerId());
        }

        Address address = Address.builder()
                .customer(customer)
                .zipcode(saveAddressReq.getZipcode())
                .address(saveAddressReq.getStreetAddress())
                .addressDetail(saveAddressReq.getAddressDetail())
                .name(saveAddressReq.getName())
                .phoneNumber(saveAddressReq.getPhoneNumber())
                .isDefaultAddress(saveAddressReq.getIsDefaultAddress())
                .addressName(saveAddressReq.getAddressName())
                .build();

        try {
            addressRepository.save(address);
        } catch (Exception e) {
            throw new BadRequestException(ExceptionCode.INVALID_ADDRESS_DATA);
        }
    }

    @Override
    @Transactional
    public void updateAddress(Long addressId, SaveAddressReq saveAddressReq) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_ADDRESS));

        if (saveAddressReq.getIsDefaultAddress() == DisplayStatus.Y) {
            resetDefaultAddress(saveAddressReq.getCustomerId());
        }

        try {
            address.update(saveAddressReq.getZipcode(),
                    saveAddressReq.getStreetAddress(),
                    saveAddressReq.getAddressDetail(),
                    saveAddressReq.getName(),
                    saveAddressReq.getPhoneNumber(),
                    saveAddressReq.getIsDefaultAddress(),
                    saveAddressReq.getAddressName());

            addressRepository.save(address);
        } catch (Exception e) {
            throw new BadRequestException(ExceptionCode.INVALID_ADDRESS_DATA);
        }
    }

    @Override
    @Transactional
    public void deleteAddress(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_ADDRESS));

        addressRepository.delete(address);
    }

    @Transactional
    protected void resetDefaultAddress(Long customerId) {
        try {
            addressRepository.resetDefaultAddress(customerId);
        } catch (Exception e) {
            throw new BadRequestException(ExceptionCode.FAILED_TO_RESET_DEFAULT_ADDRESS);
        }
    }
}
