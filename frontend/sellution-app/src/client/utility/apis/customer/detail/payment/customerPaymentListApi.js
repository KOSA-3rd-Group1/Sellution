import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/accounts';

// 회원의 결제수단 목록 조회
export const getCustomerPaymentList = async (customerId, setAccessToken, accessToken) => {
  let responseData = null;

  const url = `${API_URL}/customers/${customerId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  //   responseData = await instance.get(url);
  return responseData;
};

// 받는 데이터
// page
// private final Long accountId;
// private final Long customerId;
// private final String accountNumber;
// private final String bankCode;
// private final LocalDateTime createdAt;
