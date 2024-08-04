import BaseInstance from '@/client/utility/axios/BaseInstance';

const API_URL = '/logout';

// 로그아웃
export const logout = async () => {
  try {
    let instance = await BaseInstance();
    await instance.post(API_URL, {}, { withCredentials: true });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('auth-storage');
  }
};
