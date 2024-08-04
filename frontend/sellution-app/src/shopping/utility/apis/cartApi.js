import BaseInstance from '@/shopping/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/shopping/utility/axios/Interceptors';

const API_URL = '/api/cart';

// 장바구니 목록 조회
export const findCart = async (cartType, accessToken, setAccessToken) => {
  let responseData = null;

  const url = `${API_URL}/${cartType}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  responseData = await instance.get(url);
  return responseData;
};

//장바구니 목록 Redis에서 조회
// export const findCartFromRedis = async (cartType, accessToken, setAccessToken) => {
//   let responseData = null;

//   const url = `${API_URL}/redis/${cartType}`;

//   let instance = await BaseInstance();
//   instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

//   responseData = await instance.get(url);
//   return responseData;
// };

// 장바구니에 상품 추가
export const addToCart = async (cartType, productId, quantity, accessToken, setAccessToken) => {
  //requestParam: productId, quantity
  let responseData = null;

  const url = `${API_URL}/add/${cartType}?productId=${productId}&quantity=${quantity}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  responseData = await instance.post(url);
  return responseData;
};

// 장바구니에서 상품 제거
export const removeFromCart = async (cartType, productId, accessToken, setAccessToken) => {
  let responseData = null;

  const url = `${API_URL}/remove/${cartType}/${productId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  responseData = await instance.delete(url);
  return responseData;
};

// 장바구니 전체 삭제
export const clearCart = async (cartType, accessToken, setAccessToken) => {
  let responseData = null;

  const url = `${API_URL}/clear/${cartType}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  responseData = await instance.post(url);
  return responseData;
};

// 장바구니 상품 수량 증가
export const increaseCartItem = async (cartType, productId, accessToken, setAccessToken) => {
  let responseData = null;

  const url = `${API_URL}/increase/${cartType}/${productId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  responseData = await instance.post(url);
  return responseData;
};

// 장바구니 상품 수량 감소
export const decreaseCartItem = async (cartType, productId, accessToken, setAccessToken) => {
  let responseData = null;

  const url = `${API_URL}/decrease/${cartType}/${productId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  responseData = await instance.post(url);
  return responseData;
};
