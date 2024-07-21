import axios from 'axios';

export const BaseInstance = (option = {}) => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    ...option,
  });
  return instance;
};
