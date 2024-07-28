import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/orders';

// 회원의 주문 정보 상세 조회 - 확인 필요
export const getCustomerOrderDetail = async (customerId, setAccessToken, accessToken) => {
  let responseData = null;
  //   let url = `${API_URL}/customers/${customerId}`;

  //   let instance = await BaseInstance();
  //   instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  //   responseData = await instance.get(url);
  //   console.log(responseData);
  return responseData;
};
