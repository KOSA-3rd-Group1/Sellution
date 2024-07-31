import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/sale-setting';

// Sale Setting 조회
export const getSaleSetting = async (companyId, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}/${companyId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url);
  return response;
};

// Display Setting 변경
export const putSaleSetting = async (data, setAccessToken, accessToken) => {
  let response = null;
  const url = API_URL;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.put(url, { ...data });
  console.log('Display setting 변경 resposne >>>>', response);
  return response;
};

// 카테고리 조회
export const getAllCatogory = async (companyId, setAccessToken, accessToken) => {
  let response = null;
  const url = `/categories`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url, { params: { companyId: companyId } });
  return response;
};

// 상품 조회
export const getAllProduct = async (companyId, setAccessToken, accessToken) => {
  let response = null;
  const url = `/products`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url, { params: { companyId: companyId } });
  return response;
};
