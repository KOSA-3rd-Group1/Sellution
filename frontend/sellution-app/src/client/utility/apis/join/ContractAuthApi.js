import BaseInstance from '@/client/utility/axios/BaseInstance';

const API_URL = '/contract-company';

// 계약 고객 인증 API
export const postDuplicatedIdCheck = async (data) => {
  let response = null;
  const url = `${API_URL}/authenticate`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};
