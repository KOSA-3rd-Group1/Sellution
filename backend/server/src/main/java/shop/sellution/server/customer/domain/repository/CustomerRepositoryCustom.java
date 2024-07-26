package shop.sellution.server.customer.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.dto.CustomerSearchCondition;

public interface CustomerRepositoryCustom {
    Page<Customer> findCustomerByCompanyIdAndCondition(Long companyId, CustomerSearchCondition condition, Pageable pageable);
}
