import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/accounts';

// 결제 수단 상세 조회 - 확인 필요
export const getCustomerPaymentDetail = async (accountId, setAccessToken, accessToken) => {
  let responseData = null;
  //   let url = `${API_URL}/${accountId}`;

  //   let instance = await BaseInstance();
  //   instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  //   responseData = await instance.get(url);
  //   console.log(responseData);
  return responseData;
};

// 결제 수단 삭제
export const deleteCustomerPaymentDetail = async (accountId, setAccessToken, accessToken) => {
  let responseData = null;
  let url = `${API_URL}/${accountId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  responseData = await instance.delete(url);
  return responseData;
};
