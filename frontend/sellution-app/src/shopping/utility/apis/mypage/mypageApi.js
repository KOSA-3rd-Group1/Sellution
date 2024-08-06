import BaseInstance from '@/shopping/utility/axios/BaseInstance';

const API_URL = '/logout';

// 로그아웃
export const logout = async (setAccessToken) => {
  try {
    let instance = await BaseInstance();
    await instance.post(API_URL, {}, { withCredentials: true });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    localStorage.removeItem('shop-user-storage');
    // localStorage.removeItem('shop-auth-storage');
    setAccessToken(null);
  }
};
