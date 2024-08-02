import BaseInstance from '@/client/utility/axios/BaseInstance';

const API_URL = '/clients/signup';

// Sms 인증 번호 요청
export const postSendSignupSmsAuthNumber = async (data) => {
  let response = null;
  const url = `${API_URL}/verify-code/send`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};

// Sms 인증 번호 검증
export const postVerifySignupSmsAuthNumber = async (data) => {
  let response = null;
  const url = `${API_URL}/verify-code`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};
