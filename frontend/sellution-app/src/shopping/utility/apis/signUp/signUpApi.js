import BaseInstance from '@/shopping/utility/axios/BaseInstance';

const API_URL = '/api/customers';

// Sms 인증 번호 요청
export const postSendSignupSmsAuthNumber = async (data) => {
  let response = null;
  const url = `${API_URL}/signup/verify-code/send`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};
// {
//     "companyId": 1,
//     "phoneNumber": "01078976546"
// }

// Sms 인증 번호 검증
export const postVerifySignupSmsAuthNumber = async (data) => {
  let response = null;
  const url = `${API_URL}/signup/verify-code`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};
// {
//     "companyId": 1,
//     "name": "테스트",
//     "phoneNumber": "01078976546",
//     "authNumber": "887428"
// }

// 회원 가입
export const postSignupCustomer = async (data) => {
  let response = null;
  const url = `${API_URL}/signup`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};
// {
//   "companyId": 1,
//   "username": "testcustomer",
//   "password": "qwe123!@#",
//   "name": "테스트회원",
//   "phoneNumber": "01012341234"
// }

// 회원 아이디 중복 확인
export const postDuplicatedUsernameCheck = async (data) => {
  let response = null;
  const url = `${API_URL}/duplicate-check-id`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};
// {
//     "companyId": 2,
//     "username": "CustomerB"
// }
