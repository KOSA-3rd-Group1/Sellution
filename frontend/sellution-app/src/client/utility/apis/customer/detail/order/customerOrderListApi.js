import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/orders';

// 회원의 주문 목록 조회
export const getCustomerOrderList = async (customerId, setAccessToken, accessToken) => {
  let resposne = null;
  let url = `${API_URL}/customers/${customerId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  resposne = await instance.get(url);
  return resposne;
};

// 주문 수동 승인
export const postApproveOrder = async (orderId, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}/${orderId}/approve`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.post(url);
  return response;
};

// 주문 승인 취소
export const postCancleOrder = async (orderId, data, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}/${orderId}/cancel`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.post(url, data);
  return response;
};
