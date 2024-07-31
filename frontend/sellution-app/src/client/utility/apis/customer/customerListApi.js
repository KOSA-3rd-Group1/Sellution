import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/api/customers';

// 회원 목록 조회
export const getCustomerList = async (pageParam, setAccessToken, accessToken) => {
  let responseData = null;

  const url = API_URL;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  responseData = await instance.get(`${url}/list`, { params: { ...pageParam } });
  return responseData;
};
