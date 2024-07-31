import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/addresses';

// 결제 수단 등록
export const postCustomerAddressAdd = async (data, setAccessToken, accessToken) => {
  let response = null;
  let url = API_URL;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.post(url, { ...data });
  return response;
};
