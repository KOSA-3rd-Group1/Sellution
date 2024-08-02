import BaseInstance from '@/shopping/utility/axios/BaseInstance';

const API_URL = '/api/customers';

// 비밀번호 재설정
export const postChangePassword = async (data) => {
  let response = null;
  const url = `${API_URL}/change-password`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};
