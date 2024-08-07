package shop.sellution.server.event.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.restdocs.payload.PayloadDocumentation;
import org.springframework.restdocs.request.RequestDocumentation;
import org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders;
import shop.sellution.server.event.application.EventService;
import shop.sellution.server.event.dto.request.SaveEventReq;
import shop.sellution.server.event.dto.request.UpdateEventReq;
import shop.sellution.server.event.dto.response.FindEventRes;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.event.domain.type.EventState;
import shop.sellution.server.event.domain.type.TargetCustomerType;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EventController.class)
class EventControllerTest extends BaseControllerTest {

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EventService eventService;

    @DisplayName("이벤트 목록 조회 성공")
    @Test
    void findAllEvents_Success() throws Exception {
        // given
        LocalDate fixedStartDate = LocalDate.of(2024, 7, 22);
        LocalDate fixedEndDate = LocalDate.of(2024, 8, 6);
        PageRequest pageable = PageRequest.of(0, 10);
        List<FindEventRes> events = List.of(
                FindEventRes.builder()
                        .id(1L)
                        .couponName("event1")
                        .couponDiscountRate(10)
                        .targetCustomerType(TargetCustomerType.ALL)
                        .eventStartDate(LocalDate.of(2024, 7, 22))
                        .eventEndDate(LocalDate.of(2024, 8, 6))
                        .state(EventState.ONGOING)
                        .totalQuantity(100)
                        .build(),
                FindEventRes.builder()
                        .id(2L)
                        .couponName("event2")
                        .couponDiscountRate(20)
                        .targetCustomerType(TargetCustomerType.NEW)
                        .eventStartDate(LocalDate.of(2024, 7, 24))
                        .eventEndDate(LocalDate.of(2024, 8, 4))
                        .state(EventState.ONGOING)
                        .totalQuantity(200)
                        .build()
        );
        Page<FindEventRes> eventPage = new PageImpl<>(events, pageable, events.size());

        // 모킹된 service가 호출될 때 Page<FindEventRes>을 반환
        when(eventService.findAllEvents(fixedStartDate, fixedEndDate, pageable)).thenReturn(eventPage);

        // when & then
        mockMvc.perform(RestDocumentationRequestBuilders.get("/events")
                        .param("startDate", fixedStartDate.toString())
                        .param("endDate", fixedEndDate.toString())
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].couponName").value("event1"))
                .andExpect(jsonPath("$.content[0].couponDiscountRate").value(10))
                .andExpect(jsonPath("$.content[0].targetCustomerType").value("ALL"))
                .andExpect(jsonPath("$.content[0].eventStartDate").value("2024-07-22"))
                .andExpect(jsonPath("$.content[0].eventEndDate").value("2024-08-06"))
                .andExpect(jsonPath("$.content[0].state").value("ONGOING"))
                .andExpect(jsonPath("$.content[0].totalQuantity").value(100))
                .andExpect(jsonPath("$.content[1].id").value(2L))
                .andExpect(jsonPath("$.content[1].couponName").value("event2"))
                .andExpect(jsonPath("$.content[1].couponDiscountRate").value(20))
                .andExpect(jsonPath("$.content[1].targetCustomerType").value("NEW"))
                .andExpect(jsonPath("$.content[1].eventStartDate").value("2024-07-24"))
                .andExpect(jsonPath("$.content[1].eventEndDate").value("2024-08-04"))
                .andExpect(jsonPath("$.content[1].state").value("ONGOING"))
                .andExpect(jsonPath("$.content[1].totalQuantity").value(200))
                .andDo(document("Event/findAllEvents",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        queryParameters(
                                parameterWithName("startDate").description("이벤트 시작일").optional(),
                                parameterWithName("endDate").description("이벤트 종료일").optional(),
                                parameterWithName("page").description("페이지 번호"),
                                parameterWithName("size").description("페이지 크기")
                        ),
                        PayloadDocumentation.responseFields(
                                PayloadDocumentation.fieldWithPath("content[].id").type(JsonFieldType.NUMBER).description("이벤트 ID"),
                                PayloadDocumentation.fieldWithPath("content[].couponName").type(JsonFieldType.STRING).description("쿠폰 이름"),
                                PayloadDocumentation.fieldWithPath("content[].couponDiscountRate").type(JsonFieldType.NUMBER).description("쿠폰 할인율"),
                                PayloadDocumentation.fieldWithPath("content[].targetCustomerType").type(JsonFieldType.STRING).description("대상 고객 유형"),
                                PayloadDocumentation.fieldWithPath("content[].eventStartDate").type(JsonFieldType.STRING).description("이벤트 시작일"),
                                PayloadDocumentation.fieldWithPath("content[].eventEndDate").type(JsonFieldType.STRING).description("이벤트 종료일"),
                                PayloadDocumentation.fieldWithPath("content[].state").type(JsonFieldType.STRING).description("이벤트 상태"),
                                PayloadDocumentation.fieldWithPath("content[].totalQuantity").type(JsonFieldType.NUMBER).description("총 수량"),
                                PayloadDocumentation.fieldWithPath("pageable").ignored(),
                                PayloadDocumentation.fieldWithPath("totalPages").ignored(),
                                PayloadDocumentation.fieldWithPath("totalElements").ignored(),
                                PayloadDocumentation.fieldWithPath("last").ignored(),
                                PayloadDocumentation.fieldWithPath("numberOfElements").ignored(),
                                PayloadDocumentation.fieldWithPath("first").ignored(),
                                PayloadDocumentation.fieldWithPath("size").ignored(),
                                PayloadDocumentation.fieldWithPath("number").ignored(),
                                PayloadDocumentation.fieldWithPath("empty").ignored(),
                                PayloadDocumentation.fieldWithPath("sort.empty").ignored(),
                                PayloadDocumentation.fieldWithPath("sort.sorted").ignored(),
                                PayloadDocumentation.fieldWithPath("sort.unsorted").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.pageNumber").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.pageSize").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.sort.empty").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.sort.sorted").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.sort.unsorted").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.offset").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.paged").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.unpaged").ignored()
                        )
                ));
    }

    @DisplayName("이벤트 상세 조회 성공")
    @Test
    void findEvent_Success() throws Exception {
        // given
        Long eventId = 1L;
        FindEventRes event = FindEventRes.builder()
                .id(eventId)
                .couponName("event1")
                .couponDiscountRate(10)
                .targetCustomerType(TargetCustomerType.ALL)
                .eventStartDate(LocalDate.now().minusDays(5))
                .eventEndDate(LocalDate.now().plusDays(5))
                .state(EventState.ONGOING)
                .totalQuantity(100)
                .build();

        // 모킹된 service가 호출될 때 FindEventRes을 반환
        when(eventService.findEvent(eventId)).thenReturn(event);

        // when & then
        mockMvc.perform(RestDocumentationRequestBuilders.get("/events/{eventId}", eventId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(eventId))
                .andExpect(jsonPath("$.couponName").value("event1"))
                .andExpect(jsonPath("$.couponDiscountRate").value(10))
                .andExpect(jsonPath("$.targetCustomerType").value("ALL"))
                .andExpect(jsonPath("$.eventStartDate").value(LocalDate.now().minusDays(5).toString()))
                .andExpect(jsonPath("$.eventEndDate").value(LocalDate.now().plusDays(5).toString()))
                .andExpect(jsonPath("$.state").value("ONGOING"))
                .andExpect(jsonPath("$.totalQuantity").value(100))
                .andDo(document("Event/findEvent",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("eventId").description("이벤트 ID")
                        ),
                        PayloadDocumentation.responseFields(
                                PayloadDocumentation.fieldWithPath("id").type(JsonFieldType.NUMBER).description("이벤트 ID"),
                                PayloadDocumentation.fieldWithPath("couponName").type(JsonFieldType.STRING).description("쿠폰 이름"),
                                PayloadDocumentation.fieldWithPath("couponDiscountRate").type(JsonFieldType.NUMBER).description("쿠폰 할인율"),
                                PayloadDocumentation.fieldWithPath("targetCustomerType").type(JsonFieldType.STRING).description("대상 고객 유형"),
                                PayloadDocumentation.fieldWithPath("eventStartDate").type(JsonFieldType.STRING).description("이벤트 시작일"),
                                PayloadDocumentation.fieldWithPath("eventEndDate").type(JsonFieldType.STRING).description("이벤트 종료일"),
                                PayloadDocumentation.fieldWithPath("state").type(JsonFieldType.STRING).description("이벤트 상태"),
                                PayloadDocumentation.fieldWithPath("totalQuantity").type(JsonFieldType.NUMBER).description("총 수량")
                        )
                ));
    }

    @DisplayName("이벤트 생성 성공")
    @Test
    void saveEvent_Success() throws Exception {
        // given
        SaveEventReq saveEventReq = SaveEventReq.builder()
                .couponName("event1")
                .couponDiscountRate(10)
                .targetCustomerType(TargetCustomerType.ALL)
                .eventStartDate(LocalDate.now().plusDays(1))
                .eventEndDate(LocalDate.now().plusDays(10))
                .totalQuantity(100)
                .build();

        // when & then
        mockMvc.perform(RestDocumentationRequestBuilders.post("/events")
                        .content(objectMapper.writeValueAsString(saveEventReq))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Event/saveEvent",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        PayloadDocumentation.requestFields(
                                PayloadDocumentation.fieldWithPath("couponName").type(JsonFieldType.STRING).description("쿠폰 이름"),
                                PayloadDocumentation.fieldWithPath("couponDiscountRate").type(JsonFieldType.NUMBER).description("쿠폰 할인율"),
                                PayloadDocumentation.fieldWithPath("targetCustomerType").type(JsonFieldType.STRING).description("대상 고객 유형"),
                                PayloadDocumentation.fieldWithPath("eventStartDate").type(JsonFieldType.STRING).description("이벤트 시작일"),
                                PayloadDocumentation.fieldWithPath("eventEndDate").type(JsonFieldType.STRING).description("이벤트 종료일"),
                                PayloadDocumentation.fieldWithPath("totalQuantity").type(JsonFieldType.NUMBER).description("총 수량")
                        )
                ));
    }


    @DisplayName("이벤트 업데이트 성공")
    @Test
    void updateEvent_Success() throws Exception {
        // given
        Long eventId = 1L;
        UpdateEventReq updateEventReq = new UpdateEventReq("updatedEvent", LocalDate.now().plusDays(15));

        // when & then
        mockMvc.perform(RestDocumentationRequestBuilders.put("/events/{eventId}", eventId)
                        .content(objectMapper.writeValueAsString(updateEventReq))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Event/updateEvent",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("eventId").description("이벤트 ID")
                        ),
                        PayloadDocumentation.requestFields(
                                PayloadDocumentation.fieldWithPath("couponName").type(JsonFieldType.STRING).description("쿠폰 이름"),
                                PayloadDocumentation.fieldWithPath("eventEndDate").type(JsonFieldType.STRING).description("이벤트 종료일")
                        )
                ));
    }

    @DisplayName("이벤트 삭제 성공")
    @Test
    void deleteEvent_Success() throws Exception {
        // given
        Long eventId = 1L;

        // when & then
        mockMvc.perform(RestDocumentationRequestBuilders.delete("/events/{eventId}", eventId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Event/deleteEvent",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("eventId").description("이벤트 ID")
                        )
                ));

    }

    @DisplayName("현재 진행 중인 이벤트 조회 성공")
    @Test
    void findAllOngoingEvents_Success() throws Exception {
        // given
        Long companyId = 1L;
        List<FindEventRes> events = List.of(
                FindEventRes.builder()
                        .id(1L)
                        .couponName("event1")
                        .couponDiscountRate(10)
                        .targetCustomerType(TargetCustomerType.ALL)
                        .eventStartDate(LocalDate.now().minusDays(5))
                        .eventEndDate(LocalDate.now().plusDays(5))
                        .state(EventState.ONGOING)
                        .totalQuantity(100)
                        .build(),
                FindEventRes.builder()
                        .id(2L)
                        .couponName("event2")
                        .couponDiscountRate(20)
                        .targetCustomerType(TargetCustomerType.NEW)
                        .eventStartDate(LocalDate.now().minusDays(2))
                        .eventEndDate(LocalDate.now().plusDays(2))
                        .state(EventState.ONGOING)
                        .totalQuantity(200)
                        .build()
        );

        // 모킹된 service가 호출될 때 List<FindEventRes>을 반환
        when(eventService.findAllOngoingEvents(companyId)).thenReturn(events);

        // when & then
        mockMvc.perform(RestDocumentationRequestBuilders.get("/events/company/{companyId}", companyId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].couponName").value("event1"))
                .andExpect(jsonPath("$[0].couponDiscountRate").value(10))
                .andExpect(jsonPath("$[0].targetCustomerType").value("ALL"))
                .andExpect(jsonPath("$[0].eventStartDate").value(LocalDate.now().minusDays(5).toString()))
                .andExpect(jsonPath("$[0].eventEndDate").value(LocalDate.now().plusDays(5).toString()))
                .andExpect(jsonPath("$[0].state").value("ONGOING"))
                .andExpect(jsonPath("$[0].totalQuantity").value(100))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].couponName").value("event2"))
                .andExpect(jsonPath("$[1].couponDiscountRate").value(20))
                .andExpect(jsonPath("$[1].targetCustomerType").value("NEW"))
                .andExpect(jsonPath("$[1].eventStartDate").value(LocalDate.now().minusDays(2).toString()))
                .andExpect(jsonPath("$[1].eventEndDate").value(LocalDate.now().plusDays(2).toString()))
                .andExpect(jsonPath("$[1].state").value("ONGOING"))
                .andExpect(jsonPath("$[1].totalQuantity").value(200))
                .andDo(document("Event/findAllOngoingEvents",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("companyId").description("회사 ID")
                        ),
                        PayloadDocumentation.responseFields(
                                PayloadDocumentation.fieldWithPath("[].id").type(JsonFieldType.NUMBER).description("이벤트 ID"),
                                PayloadDocumentation.fieldWithPath("[].couponName").type(JsonFieldType.STRING).description("쿠폰 이름"),
                                PayloadDocumentation.fieldWithPath("[].couponDiscountRate").type(JsonFieldType.NUMBER).description("쿠폰 할인율"),
                                PayloadDocumentation.fieldWithPath("[].targetCustomerType").type(JsonFieldType.STRING).description("대상 고객 유형"),
                                PayloadDocumentation.fieldWithPath("[].eventStartDate").type(JsonFieldType.STRING).description("이벤트 시작일"),
                                PayloadDocumentation.fieldWithPath("[].eventEndDate").type(JsonFieldType.STRING).description("이벤트 종료일"),
                                PayloadDocumentation.fieldWithPath("[].state").type(JsonFieldType.STRING).description("이벤트 상태"),
                                PayloadDocumentation.fieldWithPath("[].totalQuantity").type(JsonFieldType.NUMBER).description("총 수량")
                        )
                ));
    }

    @DisplayName("회원 쿠폰 목록 조회 성공")
    @Test
    void findCoupons_Success() throws Exception {
        // given
        PageRequest pageable = PageRequest.of(0, 10);
        List<FindEventRes> coupons = List.of(
                FindEventRes.builder()
                        .id(1L)
                        .couponName("coupon1")
                        .couponDiscountRate(10)
                        .targetCustomerType(TargetCustomerType.ALL)
                        .eventStartDate(LocalDate.now().minusDays(5))
                        .eventEndDate(LocalDate.now().plusDays(5))
                        .state(EventState.ONGOING)
                        .totalQuantity(100)
                        .build(),
                FindEventRes.builder()
                        .id(2L)
                        .couponName("coupon2")
                        .couponDiscountRate(20)
                        .targetCustomerType(TargetCustomerType.NEW)
                        .eventStartDate(LocalDate.now().minusDays(2))
                        .eventEndDate(LocalDate.now().plusDays(2))
                        .state(EventState.ONGOING)
                        .totalQuantity(200)
                        .build()
        );
        Page<FindEventRes> couponPage = new PageImpl<>(coupons, pageable, coupons.size());

        // 모킹된 service가 호출될 때 Page<FindEventRes>을 반환
        when(eventService.findCoupons(pageable)).thenReturn(couponPage);

        // when & then
        mockMvc.perform(RestDocumentationRequestBuilders.get("/events/coupons")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].couponName").value("coupon1"))
                .andExpect(jsonPath("$.content[0].couponDiscountRate").value(10))
                .andExpect(jsonPath("$.content[0].targetCustomerType").value("ALL"))
                .andExpect(jsonPath("$.content[0].eventStartDate").value(LocalDate.now().minusDays(5).toString()))
                .andExpect(jsonPath("$.content[0].eventEndDate").value(LocalDate.now().plusDays(5).toString()))
                .andExpect(jsonPath("$.content[0].state").value("ONGOING"))
                .andExpect(jsonPath("$.content[0].totalQuantity").value(100))
                .andExpect(jsonPath("$.content[1].id").value(2L))
                .andExpect(jsonPath("$.content[1].couponName").value("coupon2"))
                .andExpect(jsonPath("$.content[1].couponDiscountRate").value(20))
                .andExpect(jsonPath("$.content[1].targetCustomerType").value("NEW"))
                .andExpect(jsonPath("$.content[1].eventStartDate").value(LocalDate.now().minusDays(2).toString()))
                .andExpect(jsonPath("$.content[1].eventEndDate").value(LocalDate.now().plusDays(2).toString()))
                .andExpect(jsonPath("$.content[1].state").value("ONGOING"))
                .andExpect(jsonPath("$.content[1].totalQuantity").value(200))
                .andDo(document("Event/findCoupons",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        PayloadDocumentation.responseFields(
                                PayloadDocumentation.fieldWithPath("content[].id").type(JsonFieldType.NUMBER).description("쿠폰 ID"),
                                PayloadDocumentation.fieldWithPath("content[].couponName").type(JsonFieldType.STRING).description("쿠폰 이름"),
                                PayloadDocumentation.fieldWithPath("content[].couponDiscountRate").type(JsonFieldType.NUMBER).description("쿠폰 할인율"),
                                PayloadDocumentation.fieldWithPath("content[].targetCustomerType").type(JsonFieldType.STRING).description("대상 고객 유형"),
                                PayloadDocumentation.fieldWithPath("content[].eventStartDate").type(JsonFieldType.STRING).description("이벤트 시작일"),
                                PayloadDocumentation.fieldWithPath("content[].eventEndDate").type(JsonFieldType.STRING).description("이벤트 종료일"),
                                PayloadDocumentation.fieldWithPath("content[].state").type(JsonFieldType.STRING).description("이벤트 상태"),
                                PayloadDocumentation.fieldWithPath("content[].totalQuantity").type(JsonFieldType.NUMBER).description("총 수량"),
                                PayloadDocumentation.fieldWithPath("pageable").ignored(),
                                PayloadDocumentation.fieldWithPath("totalPages").ignored(),
                                PayloadDocumentation.fieldWithPath("totalElements").ignored(),
                                PayloadDocumentation.fieldWithPath("last").ignored(),
                                PayloadDocumentation.fieldWithPath("numberOfElements").ignored(),
                                PayloadDocumentation.fieldWithPath("first").ignored(),
                                PayloadDocumentation.fieldWithPath("size").ignored(),
                                PayloadDocumentation.fieldWithPath("number").ignored(),
                                PayloadDocumentation.fieldWithPath("empty").ignored(),
                                PayloadDocumentation.fieldWithPath("sort.empty").ignored(),
                                PayloadDocumentation.fieldWithPath("sort.sorted").ignored(),
                                PayloadDocumentation.fieldWithPath("sort.unsorted").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.pageNumber").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.pageSize").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.sort.empty").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.sort.sorted").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.sort.unsorted").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.offset").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.paged").ignored(),
                                PayloadDocumentation.fieldWithPath("pageable.unpaged").ignored()
                        )
                ));
    }

    @DisplayName("쿠폰 다운로드 성공")
    @Test
    void saveCoupon_Success() throws Exception {
        // given
        Long eventId = 1L;

        // when
        doNothing().when(eventService).saveCoupon(eventId);

        // then
        mockMvc.perform(RestDocumentationRequestBuilders.post("/events/{eventId}/coupons", eventId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("success"))
                .andDo(document("Event/saveCoupon",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("eventId").description("이벤트 ID")
                        )
                ));
    }


}





