import { useEffect, useState } from 'react';
import useAuthStore from '@/client/store/stores/useAuthStore';
import useUserInfoStore from '@/client/store/stores/useUserInfoStore';
import useSaleSettingStore from '@/client/store/stores/useSaleSettingStore';
import {
  getSaleSetting,
  putSaleSetting,
} from '@/client/utility/apis/shopManagement/shopManagementSaleSettingApi';
import { ValidationError } from '@/client/utility/error/ValidationError';
import {
  getAllCatogory,
  getAllProduct,
} from '../../utility/apis/shopManagement/shopManagementSaleSettingApi';
import {
  formatSellType,
  formatSubscriptionType,
} from '../../utility/functions/shopManagementSaleSettingFunction';

// 더미 데이터 생성 함수
const generateEachProductDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    value: index + 1,
    code: `${Math.floor(100000 + Math.random() * 900000)}`,
    label: `상품${Math.floor(100000 + Math.random() * 900000)}`,
    categoryName: ['과일', '야채', '유기농', '건조', '동결건조', '카테고리 미설정'][
      Math.floor(Math.random() * 6)
    ],
    cost: `${Math.floor(10 + Math.random() * 90)}000`,
    group: ['과일', '야채', '유기농', '건조', '동결건조', '카테고리 미설정'][
      Math.floor(Math.random() * 6)
    ],
  }));
};

const DUMMY = {
  category: [
    { value: '1', label: '과일' },
    { value: '2', label: '야채' },
    { value: '3', label: '유기농' },
    { value: '4', label: '건조' },
    { value: '5', label: '동결건조' },
  ],
};

// 개별 상품 테이블
const HEADERS = [
  {
    key: 'code',
    label: '상품 코드',
    width: 'min-w-28 w-28 max-w-28',
  },
  {
    key: 'label',
    label: '상품명',
    width: 'min-w-32 w-32 max-w-32',
  },
  {
    key: 'categoryName',
    label: '카테고리명',
    width: 'min-w-36 w-36 max-w-36',
  },
  {
    key: 'cost',
    label: '가격',
    width: 'min-w-32 w-32 max-w-32',
  },
];

export const useShopManagementSaleSetting = ({
  openAlertModal,
  openAutoCloseModal,
  closeAutoCloseModal,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const companyId = useUserInfoStore((state) => state.companyId);
  const {
    serviceType,
    sellType,
    subscriptionType,
    sellTypeCategory,
    sellTypeEach,
    subscriptionTypeMonth,
    subscriptionTypeCount,
    setServiceType,
    setSellType,
    setSubscriptionType,
    setSellTypeCategory,
    setSellTypeEach,
    setSubscriptionTypeMonth,
    setSubscriptionTypeCount,
  } = useSaleSettingStore();

  const [data, setData] = useState({});
  const [isChange, setIsChange] = useState(false); // 변경상태 감지
  const [refresh, setRefresh] = useState(false);
  const [confirmType, setConfirmType] = useState('resetContent');

  const [selectCategoryOptions, setSelectCategoryOptioins] = useState({});
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState();
  console.log('selectCategoryOptions', selectCategoryOptions);
  console.log('selectedCategoryOptions', selectedCategoryOptions);

  const [selectEachProductOptions, setSelectEachProductOptions] = useState({});
  const [selectedEachProductOptions, setSelectedEachProductOptions] = useState();
  console.log('selectedEachProductOptions', selectedEachProductOptions);

  // 서버에 데이터 요청
  useEffect(() => {
    const fetch = async (companyId, setAccessToken, accessToken) => {
      // 카테고리를 먼저 요청해서 selectCategoryOption에 {value: categoryId, label: 이름} 형식으로 넣어줘야 함... (카테고리는 개별 상품에도 쓰이기 때문...)
      const categoryResponse = await getAllCatogory(companyId, setAccessToken, accessToken);
      console.log('categoryResponse', categoryResponse);

      const response = await getSaleSetting(companyId, setAccessToken, accessToken);
      console.log('..............', response);
      console.log(response.data);
      setServiceType(response.data.serviceType); // 배송 유형
      setSellType(formatSellType(response.data.sellType)); // 적용 상품
      //   if (response.data.sellType === 'CATEGORY') {
      //     response.data.categoryIds?.forEach((categoryId) => {});
      //   }
      setSubscriptionType(formatSubscriptionType(response.data.subscriptionType)); // 정기 배송 유형

      setData(() => ({
        serviceType: response.data.serviceType,
        // sellType: response.data.sellType,
      }));
      //   setData(...response.data);

      //   const testResponse = await getAllCatogory(companyId, setAccessToken, accessToken);
      const test2Response = await getAllProduct(companyId, setAccessToken, accessToken);
      console.log('test2Response', test2Response);
    };

    fetch(companyId, setAccessToken, accessToken);
    console.log(data);
    if (DUMMY.category != undefined) {
      setSelectCategoryOptioins(DUMMY.category);
    }
    setSelectEachProductOptions(generateEachProductDummyData(10));
  }, []);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // 카테고리 옵션 변경 handler
  const handleChangeSelectedCategoryOptions = (selectedOptions) => {
    setSelectedCategoryOptions(selectedOptions);
  };

  // 개별상품 옵션 변경 handler
  const handleChangeSelectedEachProductOptions = (selectedOptions) => {
    setSelectedEachProductOptions(selectedOptions);
  };

  // 개별 상품 옵션 제거 handler
  const handleDeleteSelectedEachProductOption = (removeProductCode) => {
    setSelectedEachProductOptions((prev) =>
      prev.filter((selectedOption) => selectedOption.product.code != removeProductCode),
    );
  };

  // 등록
  const handleSaveData = () => {
    alert('변경사항 적용');
  };

  return {
    HEADERS,
    data,
    selectCategoryOptions,
    selectedCategoryOptions,
    selectEachProductOptions,
    selectedEachProductOptions,
    handleChangeInputValue,
    handleChangeSelectedCategoryOptions,
    handleChangeSelectedEachProductOptions,
    handleDeleteSelectedEachProductOption,
    handleSaveData,
  };
};
