import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL_1 = '/login';
const API_URL_2 = '/api/customers/me';

// 로그인 기능
export const login = async (username, password, companyId, setAccessToken, setAllUserData) => {
  try {
    // 로그인
    let instance = await BaseInstance('FORM');
    const response = await instance.post(API_URL_1, {
      username,
      password,
      companyId,
      role: 'ROLE_CUSTOMER',
    });

    const accessToken = response.headers.get('Authorization').split(' ')[1];
    setAccessToken(accessToken);

    // 고객 이름 조회
    let newInstance = await BaseInstance();
    instance = await addAuthInterceptor(newInstance, setAccessToken, accessToken);
    const newResponse = await instance.get(API_URL_2);

    setAllUserData(newResponse.data.data);
    return true;
  } catch (error) {
    console.error('Login faild:', error);
    return false;
  }
};
