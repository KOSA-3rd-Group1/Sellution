import BaseInstance from '@/client/utility/axios/BaseInstance';
import { addAuthInterceptor } from '@/client/utility/axios/Interceptors';

const API_URL = '/display-setting';

// Display Setting 조회
export const getDisplaySetting = async (companyId, setAccessToken, accessToken) => {
  let response = null;
  const url = `${API_URL}/${companyId}`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url);
  console.log('Display setting 조회 resposne >>>>', response);

  return response;
};

// Display Setting 변경
export const putDisplaySetting = async (data, setAccessToken, accessToken) => {
  console.log(data);
  let response = null;
  const url = API_URL;

  let instance = await BaseInstance('MULTIPART');
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.put(url, data);
  console.log('Display setting 변경 resposne >>>>', response);
  return response;
};

// private Long companyId;

// @NotBlank(message = "회사명은 필수 입니다.")
// private String displayName;
// private String logoImageUrl; //null이면 displayName 넣어줌

// @NotBlank(message = "프로모션이미지는 필수 입니다.")
// private List<String> promotionImageUrls;

// private String themeColor; //deflaut값 있음
// private String mainPromotion1Title; //deflaut값 있음
// private String mainPromotion1Content; //deflaut값 있음
// private String mainPromotion2Title; //deflaut값 있음
// private String mainPromotion2Content; //deflaut값 있음
