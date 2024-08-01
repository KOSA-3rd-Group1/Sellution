import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/payment-histories';

export const getPaymentHistoryList = async (companyId, pageParam, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}/company/${companyId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url, { params: { ...pageParam } });
  return response;
};
