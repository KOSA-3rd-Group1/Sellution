package shop.sellution.server.order.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.address.domain.AddressRepository;
import shop.sellution.server.company.domain.CompanyRepository;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.dto.request.SaveOrderReq;

@Service
@RequiredArgsConstructor
public class OrderCreationService {

    private final CustomerRepository customerRepository;
    private final CompanyRepository companyRepository;
    private final AddressRepository addressRepository;
//    private final MonthopionRepository monthopionRepository;



    @Transactional
    public Order createOrder(SaveOrderReq saveOrderReq){

        return null;
    }




}
