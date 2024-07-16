package shop.sellution.server.order.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.address.domain.AddressRepository;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.dto.request.SaveOrderReq;

import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_COMPANY_ID;
import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_CUSTOMER;

@Service
@RequiredArgsConstructor
public class OrderCreationService {

    private final CustomerRepository customerRepository;
    private final CompanyRepository companyRepository;
    private final AddressRepository addressRepository;
//    private final MonthopionRepository monthopionRepository;



    @Transactional
    public Order createOrder(SaveOrderReq saveOrderReq){
        Company company = companyRepository.findById(saveOrderReq.getCompanyId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_COMPANY_ID));
        Customer customer = customerRepository.findById(saveOrderReq.getCustomerId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));



        return null;
    }




}
