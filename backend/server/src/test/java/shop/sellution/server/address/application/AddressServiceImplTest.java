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
                .id(1L)
                .customer(customer)
                .addressName("Home")
                .name("John Doe")
                .phoneNumber("010-9999-9999")
                .zipcode("12345")
                .streetAddress("123 Street")
                .addressDetail("Apt 101")
                .isDefaultAddress(DisplayStatus.Y)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @DisplayName("고객 ID로 주소 목록을 조회한다.")
    @Test
    void getAddressesByCustomerId_Success() {
        // given
        when(addressRepository.findByCustomer_Id(anyLong())).thenReturn(List.of(address));

        // when
        List<FindAllAddressRes> addresses = addressService.getAddressesByCustomerId(1L);

        // then
        assertThat(addresses).isNotEmpty();
        verify(addressRepository, times(1)).findByCustomer_Id(anyLong());
    }

    @DisplayName("주소 ID로 주소를 조회한다.")
    @Test
    void getAddressById_Success() {
        // given
        when(addressRepository.findById(anyLong())).thenReturn(Optional.of(address));

        // when
        FindAddressRes addressRes = addressService.getAddressById(1L);

        // then
        assertThat(addressRes).isNotNull();
        verify(addressRepository, times(1)).findById(anyLong());
    }

    @DisplayName("주소 ID로 주소를 조회할 때 주소가 없으면 예외를 발생시킨다.")
    @Test
    void getAddressById_NotFound_Fail() {
        // given
        when(addressRepository.findById(anyLong())).thenReturn(Optional.empty());

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> addressService.getAddressById(1L));
        assertThat(exception.getMessage()).isEqualTo("Address not found");
    }

    @DisplayName("주소를 생성한다.")
    @Test
    void createAddress_Success() {
        // given
        SaveAddressReq request = SaveAddressReq.builder()
                .customerId(1L)
                .addressName("Home")
                .name("John Doe")
                .phoneNumber("010-9999-9999")
                .zipcode("12345")
                .streetAddress("123 Street")
                .addressDetail("Apt 101")
                .isDefaultAddress(DisplayStatus.Y)
                .build();
        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(customer));
        when(addressRepository.save(any(Address.class))).thenReturn(address);

        // when
        addressService.createAddress(request);

        // then
        verify(customerRepository, times(1)).findById(anyLong());
        verify(addressRepository, times(1)).save(any(Address.class));
    }

    @DisplayName("주소를 생성할 때 고객이 없으면 예외를 발생시킨다.")
    @Test
    void createAddress_CustomerNotFound_Fail() {
        // given
        SaveAddressReq request = SaveAddressReq.builder()
                .customerId(1L)
                .addressName("Home")
                .name("John Doe")
                .phoneNumber("010-9999-9999")
                .zipcode("12345")
                .streetAddress("123 Street")
                .addressDetail("Apt 101")
                .isDefaultAddress(DisplayStatus.Y)
                .build();
        when(customerRepository.findById(anyLong())).thenReturn(Optional.empty());

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> addressService.createAddress(request));
        assertThat(exception.getMessage()).isEqualTo("Customer not found");
    }

    @DisplayName("주소를 수정한다.")
    @Test
    void updateAddress_Success() {
        // given
        SaveAddressReq request = SaveAddressReq.builder()
                .customerId(1L)
                .addressName("Home")
                .name("John Doe")
                .phoneNumber("010-9999-9999")
                .zipcode("12345")
                .streetAddress("123 Street")
                .addressDetail("Apt 101")
                .isDefaultAddress(DisplayStatus.Y)
                .build();
        when(addressRepository.findById(anyLong())).thenReturn(Optional.of(address));

        // when
        addressService.updateAddress(1L, request);

        // then
        verify(addressRepository, times(1)).findById(anyLong());
        verify(addressRepository, times(1)).save(any(Address.class));
    }

    @DisplayName("주소를 수정할 때 주소가 없으면 예외를 발생시킨다.")
    @Test
    void updateAddress_NotFound_Fail() {
        // given
        SaveAddressReq request = SaveAddressReq.builder()
                .customerId(1L)
                .addressName("Home")
                .name("John Doe")
                .phoneNumber("010-9999-9999")
                .zipcode("12345")
                .streetAddress("123 Street")
                .addressDetail("Apt 101")
                .isDefaultAddress(DisplayStatus.Y)
                .build();
        when(addressRepository.findById(anyLong())).thenReturn(Optional.empty());

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> addressService.updateAddress(1L, request));
        assertThat(exception.getMessage()).isEqualTo("Address not found");
    }

    @DisplayName("주소를 삭제한다.")
    @Test
    void deleteAddress_Success() {
        // when
        addressService.deleteAddress(1L);

        // then
        verify(addressRepository, times(1)).deleteById(anyLong());
    }
}
