import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import useUserInfoStore from '@/client/store/stores/useUserInfoStore';
import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

export const useAuth = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setName = useUserInfoStore((state) => state.setName);

  // 로그인 기능
  const login = async (username, password) => {
    try {
      const response = await BaseInstance('FORM').post('/login', {
        username,
        password,
        role: 'ROLE_CLIENT',
      });
      const accessToken = response.headers.get('Authorization').split(' ')[1];
      setAccessToken(accessToken);

      // 고객 이름 조회
      const response2 = await addAuthInterceptor(
        BaseInstance(),
        refreshAccessToken,
        accessToken,
      ).get('/clients/me');
      setName(response2.data.name);
      return true;
    } catch (error) {
      console.error('Login faild:', error);
      return false;
    }
  };

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await BaseInstance().post('/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setAccessToken(null);
      navigate({
        pathname: '/login',
      });
    }
  }, []);

  // 토큰 재발급 요청
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await BaseInstance().post('/refresh', {}, { withCredentials: true });
      const accessToken = response.headers.get('Authorization').split(' ')[1];
      setAccessToken(accessToken);
      return accessToken;
    } catch (error) {
      if (error.response?.data?.code === 9101) {
        await logout();
        throw new Error('리프레시 토큰이 유효하지 않습니다. 다시 로그인해 주세요.');
      }
      throw error;
    }
  }, []);

  // 인증용 base api
  const AuthBaseInstance = (contentType = 'JSON') => {
    return addAuthInterceptor(BaseInstance(contentType), refreshAccessToken, accessToken);
  };

  return {
    login,
    logout,
    AuthBaseInstance,
  };
};
