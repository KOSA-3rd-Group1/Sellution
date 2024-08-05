import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/display-setting';

// Display Setting 조회
export const getDisplaySetting = async (companyId, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}/${companyId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url);
  return response;
};

// Display Setting 변경
export const putDisplaySetting = async (data, setAccessToken, accessToken) => {
  let response = null;
  const url = API_URL;

  let instance = await BaseInstance('MULTIPART');
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.put(url, data);
  return response;
};
