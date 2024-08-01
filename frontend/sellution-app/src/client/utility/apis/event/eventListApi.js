import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/events';

export const getEventList = async (pageParam, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url, { params: { ...pageParam } });
  return response;
};

// 이벤트 정보 삭제
export const deleteEventList = async (eventId, setAccessToken, accessToken) => {
  let response = null;
  let url = `${API_URL}/${eventId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.delete(url);
  return response;
};
