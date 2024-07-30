import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/events';

export const postEventAdd = async (data, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.post(url, { ...data });
  return response;
};

// private String couponName;
// private Integer couponDiscountRate;
// private TargetCustomerType targetCustomerType;
// private LocalDate eventStartDate; 이거
// private LocalDate eventEndDate; 이거
// private Integer totalQuantity;
