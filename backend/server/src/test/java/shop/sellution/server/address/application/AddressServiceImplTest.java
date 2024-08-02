package shop.sellution.server.address.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.address.domain.AddressRepository;
import shop.sellution.server.address.dto.request.SaveAddressReq;
import shop.sellution.server.address.dto.response.FindAddressRes;
import shop.sellution.server.address.dto.response.FindAllAddressRes;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.global.type.DisplayStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AddressServiceImplTest {

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private AddressServiceImpl addressService;

    private Address address;
    private Customer customer;
    private SaveAddressReq saveAddressReq;

    @BeforeEach
    void setUp() {
        customer = Customer.builder()
                .id(1L)
                .username("john_doe")
                .password("password")
                .name("John Doe")
                .phoneNumber("010-9999-9999")
                .build();

        address = Address.builder()
                .customer(customer)
                .addressName("Home")
                .name("John Doe")
                .phoneNumber("010-9999-9999")
                .zipcode("12345")
                .address("123 Street")
                .addressDetail("Apt 101")
                .isDefaultAddress(DisplayStatus.Y)
                .build();

        saveAddressReq = SaveAddressReq.builder()
                .customerId(1L)
                .addressName("Home")
                .name("John Doe")
                .phoneNumber("010-9999-9999")
                .zipcode("12345")
                .streetAddress("123 Street")
                .addressDetail("Apt 101")
                .isDefaultAddress(DisplayStatus.Y)
                .build();
    }

    @DisplayName("고객 ID로 주소 목록을 조회한다.")
    @Test
    void getAddressesByCustomerId_Success() {
        when(customerRepository.existsById(anyLong())).thenReturn(true);
        when(addressRepository.findByCustomer_Id(anyLong())).thenReturn(List.of(address));

        List<FindAllAddressRes> addresses = addressService.getAddressesByCustomerId(1L);

        assertThat(addresses).isNotEmpty();
        verify(customerRepository, times(1)).existsById(anyLong());
        verify(addressRepository, times(1)).findByCustomer_Id(anyLong());
    }

    @DisplayName("존재하지 않는 고객 ID로 주소 목록을 조회하면 예외가 발생한다.")
    @Test
    void getAddressesByCustomerId_CustomerNotFound_ThrowsException() {
        when(customerRepository.existsById(anyLong())).thenReturn(false);

        assertThrows(BadRequestException.class, () -> addressService.getAddressesByCustomerId(1L));
        verify(customerRepository, times(1)).existsById(anyLong());
    }

    @DisplayName("주소 ID로 주소를 조회한다.")
    @Test
    void getAddressById_Success() {
        when(addressRepository.findById(anyLong())).thenReturn(Optional.of(address));

        FindAddressRes addressRes = addressService.getAddressById(1L);

        assertThat(addressRes).isNotNull();
        verify(addressRepository, times(1)).findById(anyLong());
    }

    @DisplayName("주소 ID로 주소를 조회할 때 주소가 없으면 예외를 발생시킨다.")
    @Test
    void getAddressById_NotFound_ThrowsException() {
        when(addressRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> addressService.getAddressById(1L));
    }

    @DisplayName("주소를 생성한다.")
    @Test
    void createAddress_Success() {
        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(customer));
        when(addressRepository.save(any(Address.class))).thenReturn(address);

        addressService.createAddress(saveAddressReq);

        verify(customerRepository, times(1)).findById(anyLong());
        verify(addressRepository, times(1)).save(any(Address.class));
    }

    @DisplayName("주소를 생성할 때 고객이 없으면 예외를 발생시킨다.")
    @Test
    void createAddress_CustomerNotFound_ThrowsException() {
        when(customerRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> addressService.createAddress(saveAddressReq));
    }

    @DisplayName("주소를 수정한다.")
    @Test
    void updateAddress_Success() {
        when(addressRepository.findById(anyLong())).thenReturn(Optional.of(address));

        addressService.updateAddress(1L, saveAddressReq);

        verify(addressRepository, times(1)).findById(anyLong());
        verify(addressRepository, times(1)).save(any(Address.class));
    }

    @DisplayName("주소를 수정할 때 주소가 없으면 예외를 발생시킨다.")
    @Test
    void updateAddress_NotFound_ThrowsException() {
        when(addressRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> addressService.updateAddress(1L, saveAddressReq));
    }

//    @DisplayName("주소를 삭제한다.")
//    @Test
//    void deleteAddress_Success() {
//        when(addressRepository.findById(anyLong())).thenReturn(Optional.of(address));
//
//        addressService.deleteAddress(1L);
//
//        verify(addressRepository, times(1)).findById(anyLong());
//        verify(addressRepository, times(1)).delete(any(Address.class));
//    }

    @DisplayName("주소를 삭제할 때 주소가 없으면 예외를 발생시킨다.")
    @Test
    void deleteAddress_NotFound_ThrowsException() {
        when(addressRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> addressService.deleteAddress(1L));
    }

    @DisplayName("기본 주소를 재설정한다.")
    @Test
    void resetDefaultAddress_Success() {
        doNothing().when(addressRepository).resetDefaultAddress(anyLong());

        addressService.resetDefaultAddress(1L);

        verify(addressRepository, times(1)).resetDefaultAddress(anyLong());
    }

    @DisplayName("기본 주소 재설정 실패 시 예외를 발생시킨다.")
    @Test
    void resetDefaultAddress_Fail_ThrowsException() {
        doThrow(new RuntimeException()).when(addressRepository).resetDefaultAddress(anyLong());

        assertThrows(BadRequestException.class, () -> addressService.resetDefaultAddress(1L));
    }
}