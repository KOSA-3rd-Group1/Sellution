import axios from 'axios';
import { addContentTypeInterceptor } from '@/client/utility/axios/Interceptors';

const BaseInstance = (contentType = 'JSON') => {
  let instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
  });

  // Content-Type interceptor 추가
  return addContentTypeInterceptor(instance, contentType);
};

export default BaseInstance;
