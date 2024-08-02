import BaseInstance from '@/client/utility/axios/BaseInstance';

const API_URL = '/clients';

// 고객 회원 가입
export const postRegisterClient = async (data) => {
  let response = null;
  const url = `${API_URL}/signup`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};

// 고객 아이디 중복 확인
export const postDuplicatedUsernameCheck = async (data) => {
  let response = null;
  const url = `${API_URL}/duplicate-check-id`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};

// data = {username}
