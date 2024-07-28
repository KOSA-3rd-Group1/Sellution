import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/addresses';

// 회원의 배송지 목록 조회
export const getCustomerAddressList = async (customerId, setAccessToken, accessToken) => {
  let response = null;

  const url = `${API_URL}/customer/${customerId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url);
  return response;
};
