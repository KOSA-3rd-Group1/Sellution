import BaseInstance from '@/shopping/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/shopping/utility/axios/Interceptors';

const API_URL = '/events';

// 회원 목록 조회
export const getMyCouponList = async (accessToken, setAccessToken) => {
  let responseData = null;

  const url = `${API_URL}/coupons`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  responseData = await instance.get(url);
  return responseData;
};
