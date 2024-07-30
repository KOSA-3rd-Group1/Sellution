import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/events';

// 주문 목록 조회 -> 이거 companyId는 security context holder에서 꺼내 쓰는 걸로 backend 코드 수정 필요.. 우선 companyId 값 넣어 동작하는지만 체크
export const getEventList = async (pageParam, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url, { params: { ...pageParam } });
  return response;
};
