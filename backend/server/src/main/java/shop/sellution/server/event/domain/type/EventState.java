package shop.sellution.server.event.domain.type;

public enum EventState {
    UPCOMING("진행예정"),
    ONGOING("진행중"),
    END("종료");
//    FORCED_STOP("강제종료");

    EventState(String s) {
    }
}
