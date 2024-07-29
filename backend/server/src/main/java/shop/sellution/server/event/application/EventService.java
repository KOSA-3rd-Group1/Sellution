package shop.sellution.server.event.application;

import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.event.dto.request.SaveEventReq;
import shop.sellution.server.event.dto.request.UpdateEventReq;
import shop.sellution.server.event.dto.response.FindEventRes;

import java.time.LocalDate;
import java.util.List;

public interface EventService {
    Page<FindEventRes> findAllEvents(LocalDate startDate, LocalDate endDate, Pageable pageable);

    void saveEvent(SaveEventReq saveEventReq);

    void updateEvent(Long eventId, UpdateEventReq updateEventReq);

    void deleteEvent(Long eventId);

    List<FindEventRes> findAllOngoingEvents(Long companyId);

    Page<FindEventRes> findCoupons(Pageable pageable);

    void saveCoupon(Long eventId);

    void downloadCoupon(Long customerId, Long eventId);
}
