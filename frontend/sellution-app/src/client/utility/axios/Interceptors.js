import BaseInstance from '@/client/utility/axios/BaseInstance';

const contentTypes = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
};

// Content Type 변환 인터셉터
export const addContentTypeInterceptor = (instance, contentTypeKey) => {
  if (!(contentTypeKey in contentTypes)) {
    throw new Error(`Invalid content type key: ${contentTypeKey}`);
  }

  instance.interceptors.request.use((config) => {
    config.headers['Content-Type'] = contentTypes[contentTypeKey];
    return config;
  });
  return instance;
};

// 인증 처리 interceptor - 로그인이 필요한 서비스의 요청의 경우 모두 해당 interceptor를 적용해야 한다.
export const addAuthInterceptor = (instance, setAccessToken, accessToken = null) => {
  console.log(accessToken);
  // Request Interceptor
  instance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 토큰 재발급 로직
      const refreshAccessToken = async () => {
        try {
          const response = await BaseInstance().post('/refresh', {}, { withCredentials: true });
          const accessToken = response.headers.get('Authorization').split(' ')[1];
          setAccessToken(accessToken);
          return accessToken;
        } catch (error) {
          if (error.response?.data?.code === 9101) {
            // await logout();
            window.location.href = '/login';
            throw new Error('리프레시 토큰이 유효하지 않습니다. 다시 로그인해 주세요.');
          }
          //   throw error;
          throw new Error('리프레시 토큰이 유효하지 않습니다. 다시 로그인해 주세요.');
        }
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshAccessToken();
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};
