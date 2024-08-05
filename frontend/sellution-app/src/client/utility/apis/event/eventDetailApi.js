import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/events';

// 이벤트 정보 상세 조회
export const getEventDetail = async (eventId, setAccessToken, accessToken) => {
  let response = null;
  let url = `${API_URL}/${eventId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url);
  return response;
};

// 이벤트 정보 수정
export const putEventDetail = async (eventId, data, setAccessToken, accessToken) => {
  let response = null;
  let url = `${API_URL}/${eventId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.put(url, { ...data });
  return response;
};

// 이벤트 정보 삭제
export const deleteEventDetail = async (eventId, setAccessToken, accessToken) => {
  let response = null;
  let url = `${API_URL}/${eventId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.delete(url);
  return response;
};
