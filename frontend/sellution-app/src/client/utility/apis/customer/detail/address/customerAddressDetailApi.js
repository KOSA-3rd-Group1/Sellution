import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/addresses';

// 배송지 정보 상세 조회
export const getCustomerAddressDetail = async (addressId, setAccessToken, accessToken) => {
  let response = null;
  let url = `${API_URL}/${addressId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url);
  return response;
};

// 배송지 정보 수정
export const putCustomerAddressDetail = async (addressId, data, setAccessToken, accessToken) => {
  let response = null;
  let url = `${API_URL}/${addressId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.put(url, { ...data });
  return response;
};

// 배송지 정보 삭제
export const deleteCustomerAddressDetail = async (addressId, setAccessToken, accessToken) => {
  let response = null;
  let url = `${API_URL}/${addressId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.delete(url);
  return response;
};
