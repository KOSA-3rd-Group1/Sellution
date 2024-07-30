import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/accounts';

// 회원의 결제수단 목록 조회
export const getCustomerPaymentList = async (customerId, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}/customers/${customerId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url);
  return response;
};
