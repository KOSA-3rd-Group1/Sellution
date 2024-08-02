import BaseInstance from '@/shopping/utility/axios/BaseInstance';

const API_URL = '/api/customers';

// 비밀번호 찾기
// Sms 인증 번호 요청
export const postSendFindPasswordSmsAuthNumber = async (data) => {
  let response = null;
  const url = `${API_URL}/find-password/send`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};

// Sms 인증 번호 검증
export const postVerifyFindPasswordSmsAuthNumber = async (data) => {
  let response = null;
  const url = `${API_URL}/find-password`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};
