import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/orders/customers';

// 회원의 주문 목록 조회
export const getCustomerOrderList = async (customerId, setAccessToken, accessToken) => {
  let responseData = null;
  let url = `${API_URL}/${customerId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  //   responseData = await instance.get(url);
  return responseData;
};

// 리턴받는 정보
// page
// private FindCustomerSummaryRes customer;
// private FindAddressSummaryRes address;
// private Long orderCode;
// private OrderType type;
// private OrderStatus status;
// private DeliveryStatus deliveryStatus;
// private int totalPrice;
// private LocalDate deliveryStartDate;
// private LocalDate deliveryEndDate;
// private int totalDeliveryCount;
// private int remainingDeliveryCount;
// private List<FindOrderedProductRes> orderedProductList;
// private LocalDateTime createdAt;
// private List<DayValueType> selectedDayList;
// private Integer selectedWeekOption;
// private Integer selectedMonthOption;
