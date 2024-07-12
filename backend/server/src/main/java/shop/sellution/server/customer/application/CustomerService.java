package shop.sellution.server.customer.application;

import shop.sellution.server.customer.dto.request.SaveCustomerReq;

public interface CustomerService {
    Long saveCustomer(SaveCustomerReq request);

}
