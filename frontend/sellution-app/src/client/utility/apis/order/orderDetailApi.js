import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/orders';

// 주문 목록 조회
export const getOrderDetail = async (orderId, pageParam, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}/${orderId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url, { params: { ...pageParam } });
  return response;
};
