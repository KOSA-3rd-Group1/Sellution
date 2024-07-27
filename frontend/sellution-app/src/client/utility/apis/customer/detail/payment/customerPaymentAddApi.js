import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/accounts';

// 결제 수단 등록
export const postCustomerPaymentAdd = async (
  customerId,
  accountNumber,
  bankCode,
  setAccessToken,
  accessToken,
) => {
  let response = null;
  let url = `${API_URL}/customers/${customerId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);
  console.log('이거 잘나오나?', accountNumber, bankCode);
  //   response = await instance.post(url, { accountNumber, bankCode });
  console.log(response);
  return response;
};

//data
// @NotBlank(message = "계좌번호는 필수입니다.")
// private String accountNumber;

// @NotNull(message = "은행 코드는 필수입니다.")
// @ValidBankCode
// private String bankCode;
