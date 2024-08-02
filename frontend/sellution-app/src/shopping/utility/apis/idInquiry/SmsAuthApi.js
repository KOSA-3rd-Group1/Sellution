import BaseInstance from '@/shopping/utility/axios/BaseInstance';

const API_URL = '/api/customers';

// Sms 인증 번호 요청
export const postSendFindIdSmsAuthNumber = async (data) => {
  let response = null;
  const url = `${API_URL}/find-id/send`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};

// Sms 인증 번호 검증
export const postVerifyFindIdSmsAuthNumber = async (data) => {
  let response = null;
  const url = `${API_URL}/find-id`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};
