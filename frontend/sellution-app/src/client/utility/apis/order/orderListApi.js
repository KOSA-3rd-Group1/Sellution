import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/orders';

// 주문 목록 조회
export const getOrderList = async (companyId, pageParam, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}/company/${companyId}?sort=createdAt,desc`;
  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url, { params: { ...pageParam } });
  return response;
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

// 주문 자동 승인 토글
export const postAutoApproveToggle = async (companyId, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}/auto-approve-toggle/company/${companyId}`;

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

// 주문 승인 대기 건수 조회
export const getHoldOrderCount = async (companyId, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}/company/${companyId}/unapproved-count`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url);
  return response;
};
