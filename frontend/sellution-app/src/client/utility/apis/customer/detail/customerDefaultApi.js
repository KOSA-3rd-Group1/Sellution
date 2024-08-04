import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/api/customers';

// 회원 상세 조회
export const getCustomerDefault = async (customerId, setAccessToken, accessToken) => {
  let responseData = null;
  let url = `${API_URL}/${customerId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  responseData = await instance.get(url);
  return responseData;
};

// 회원 정보 수정
export const putCustomerDefault = async (
  customerId,
  customerName,
  phoneNumber,
  setAccessToken,
  accessToken,
) => {
  let responseData = null;
  let url = `${API_URL}/${customerId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  responseData = await instance.put(url, {
    customerName,
    phoneNumber,
  });
  return responseData;
};
