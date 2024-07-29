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
  console.log('sals setting 조회 resposne >>>>', response);
  return response;
};

// private Long companyId;
// private DeliveryType serviceType;
// private SellType sellType;
// private SubscriptionType subscriptionType;

// private List<Long> categoryIds;
// private List<Long> productIds;

// private Integer minDeliveryCount;
// private Integer maxDeliveryCount;

// private List<FindOptionRes> monthValues;
// private List<FindOptionRes> weekValues;
// private List<FindOptionRes> dayValues;

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

// private Long companyId;

//     @NotBlank(message = "배송 유형 선택은 필수입니다.")
//     private DeliveryType serviceType; //단건, 정기, 둘다

//     @NotBlank(message = "게시할 상품 선택은 필수입니다.")
//     private SellType sellType; //전체 상품, 카테고리, 개별 상품

//     private List<Long> categories; // sellType 카테고리일때 받아와야함
//     private List<Long> products;

//     private SubscriptionType subscriptionType; //월단위, 횟수단위, null(단건) 가능

//     @Min(5)
//     @Max(30)
//     private int minDeliveryCount;

//     @Min(5)
//     @Max(30)
//     private int maxDeliveryCount;

//     private List<String> dayOptions;
//     private List<Integer> weekOptions;
//     private List<Integer> monthOptions; //subscriptionType이 MONTH일 경우에만 받아옴

// 카테고리 조회
export const getAllCatogory = async (companyId, setAccessToken, accessToken) => {
  let response = null;
  const url = `/categories`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url, { params: { companyId: companyId } });
  console.log('getAllCategory 조회 resposne >>>>', response);
  return response;
};

// 상품 조회
export const getAllProduct = async (companyId, setAccessToken, accessToken) => {
  let response = null;
  const url = `/products`;

  let instance = await BaseInstance();
  instance = await addAuthInterceptor(instance, setAccessToken, accessToken);

  response = await instance.get(url, { params: { companyId: companyId } });
  console.log('getAllProduct 조회 resposne >>>>', response);
  return response;
};
