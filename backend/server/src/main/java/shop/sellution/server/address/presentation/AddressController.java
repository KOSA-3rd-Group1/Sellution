package shop.sellution.server.address.presentation;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.address.application.AddressServiceImpl;
import shop.sellution.server.address.dto.request.SaveAddressReq;
import shop.sellution.server.address.dto.response.FindAddressRes;
import shop.sellution.server.address.dto.response.FindAllAddressRes;

import java.util.List;

@RestController
@RequestMapping("/addresses")
public class AddressController {

    private final AddressServiceImpl customerAddressService;

    public AddressController(AddressServiceImpl customerAddressService) {
        this.customerAddressService = customerAddressService;
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<FindAllAddressRes>> getAddressesByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerAddressService.getAddressesByCustomerId(customerId));
    }

    @GetMapping("/{addressId}")
    public ResponseEntity<FindAddressRes> getAddressById(@PathVariable Long addressId) {
        return ResponseEntity.ok(customerAddressService.getAddressById(addressId));
    }

    @PostMapping
    public ResponseEntity<Void> createAddress(@Valid @RequestBody SaveAddressReq addressRequestDTO) {
        customerAddressService.createAddress(addressRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<Void> updateAddress(@PathVariable Long addressId, @Valid @RequestBody SaveAddressReq addressRequestDTO) {
        customerAddressService.updateAddress(addressId, addressRequestDTO);
        return ResponseEntity.noContent().build();
    }


    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long addressId) {
        customerAddressService.deleteAddress(addressId);
        return ResponseEntity.noContent().build();
    }


}

