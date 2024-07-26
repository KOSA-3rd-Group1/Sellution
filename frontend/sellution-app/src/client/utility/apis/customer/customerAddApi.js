import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/api/customers/self';

// 회원 등록
export const postCustomerAdd = async (customerName, phoneNumber, setAccessToken, accessToken) => {
  let responseData = null;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  responseData = await instance.post(API_URL, {
    customerName,
    phoneNumber,
  });
  console.log(responseData);
  return responseData;
};
