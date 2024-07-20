//인터셉터 설정
//요청 전 Content-Type 타입을 변경
//default = 'Content-Type': 'application/json'
const contentType = {
  1: 'application/x-www-form-urlencoded',
  2: 'multipart/form-data',
};

export const TypeInterceptors = (instance, typeNum) => {
  instance.interceptors.request.use((config) => {
    config.headers['Content-Type'] = contentType[typeNum];
    return config;
  });
  return instance;
};
