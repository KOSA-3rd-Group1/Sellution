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

// {
//   "companyId": 1,
//   "username": "testclient",
//   "password": "qwe123!@#",
//   "name": "테스트고객",
//   "phoneNumber": "01087654321",
//   "permissions": ["CUSTOMER_MANAGEMENT", "PRODUCT_MANAGEMENT"]
// }

// CUSTOMER_MANAGEMENT(1),     // (이진수: 000001) - 회원 관리 허가
// PRODUCT_MANAGEMENT(1 << 1), // (이진수: 000010) - 상품 관리 허가
// ORDER_MANAGEMENT(1 << 2),   // (이진수: 000100) - 주문 관리 허가
// PAYMENT_MANAGEMENT(1 << 3), // (이진수: 001000) - 결제 내역 관리 허가
// EVENT_MANAGEMENT(1 << 4),   // (이진수: 010000) - 이벤트 관리 허가
// SHOP_MANAGEMENT(1 << 5);    // (이진수: 100000) - 쇼핑몰 관리 허가

// 고객 아이디 중복 확인
export const postDuplicatedUsernameCheck = async (data) => {
  let response = null;
  const url = `${API_URL}/duplicate-check-id`;

  let instance = await BaseInstance();

  response = await instance.post(url, data);
  return response;
};

// data = {username}
