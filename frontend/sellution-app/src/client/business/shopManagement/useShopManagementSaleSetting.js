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
  formatDayValues,
  formatSelectCategoryOptions,
  formatSelectEachProductOptions,
  formatSelectedCategoryOptions,
  formatSelectedEachProductOptions,
  formatSelectedMonthOptions,
  formatSellType,
  formatSubscriptionType,
  formatWeekValues,
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
    saleTypes,
    // sellType,
    // subscriptionType,
    sellTypeCategory,
    sellTypeEach,
    subscriptionTypeMonth,
    subscriptionTypeCount,
    // setServiceType,
    // setSellType,
    // setSubscriptionType,
    setSaleTypes,
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

  const [selectEachProductOptions, setSelectEachProductOptions] = useState({});
  const [selectedEachProductOptions, setSelectedEachProductOptions] = useState();
  console.log('selectEachProductOptions', selectEachProductOptions);
  console.log('selectedEachProductOptions', selectedEachProductOptions);

  // 서버에 데이터 요청
  useEffect(() => {
    const fetch = async (companyId, setAccessToken, accessToken) => {
      // 선택 가능한 카테고리 조회
      const categoryResponse = await getAllCatogory(companyId, setAccessToken, accessToken);
      const newSelectCategoryOptions = await formatSelectCategoryOptions(
        categoryResponse.data.content,
      );
      setSellTypeCategory({ selectOptions: newSelectCategoryOptions });

      // 선택 가능한 개별 상품 조회
      const productResponse = await getAllProduct(companyId, setAccessToken, accessToken);
      const newSelectEachProductOptions = await formatSelectEachProductOptions(
        productResponse.data.content,
      );
      setSellTypeEach({ selectOptions: newSelectEachProductOptions });
      setSelectEachProductOptions(newSelectEachProductOptions);

      // 판매 설정 데이터 조회
      const response = await getSaleSetting(companyId, setAccessToken, accessToken);

      // 배송 유형 (ONETIME, SUBSCRIPTION, BOTH)
      setSaleTypes({ serviceType: response.data.serviceType });

      // 적용 상품 (ALL: 0, CATEGORY: 1, EACH: 2)
      setSaleTypes({ sellType: formatSellType(response.data.sellType) });

      // 정기 배송 유형 (MONTH: 0, COUNT: 1)
      setSaleTypes({ subscriptionType: formatSubscriptionType(response.data.subscriptionType) });

      console.log('..............', response);

      // 적용 상품이 카테고리이고, 적용된 카테고리가 있는 경우,
      if (response.data.categoryIds !== null) {
        const newSelectedCateogryOptions = await formatSelectedCategoryOptions(
          response.data.categoryIds,
          newSelectCategoryOptions,
        );
        setSellTypeCategory({ selectedOptions: newSelectedCateogryOptions });
      }

      // 적용 상품이 개별 상품이고, 적용된 개별 상품이 있는 경우,
      if (response.data.productIds !== null) {
        const newSelectedEachProductOptions = await formatSelectedEachProductOptions(
          //   response.data.productIds,
          ['1', '2', '4'],
          newSelectEachProductOptions,
        );
        setSellTypeEach({ selectedOptions: newSelectedEachProductOptions });
        // setSelectedEachProductOptions(newSelectedEachProductOptions);
      }

      // 정기 배송 유형 - 월단위 결제 - 이용기간
      setSubscriptionTypeMonth({
        selectedMonthOptions: formatSelectedMonthOptions(response.data.monthValues),
      });

      // 정기 배송 유형 - 월 단위 결제인 경우
      if (response.data.subscriptionType === 'MONTH') {
        // 배송주기
        const newWeekValues = formatWeekValues(response.data.weekValues);
        setSubscriptionTypeMonth({ weekValues: newWeekValues });
        // 배송가능 요일
        const newDayValues = formatDayValues(response.data.dayValues);
        setSubscriptionTypeMonth({ dayValues: newDayValues });
      }

      // 정기 배송 유형 - 횟수단위 결제 -이용 횟수
      setSubscriptionTypeCount({
        maxDeliveryCount: response.data.maxDeliveryCount,
        minDeliveryCount: response.data.minDeliveryCount,
      });

      // 정기 배송 유형이 횟수 단위 결제인 경우
      if (response.data.subscriptionType === 'COUNT') {
        // 배송주기
        const newWeekValues = formatWeekValues(response.data.weekValues);
        setSubscriptionTypeCount({ weekValues: newWeekValues });
        // 배송가능 요일
        const newDayValues = formatDayValues(response.data.dayValues);
        setSubscriptionTypeCount({ dayValues: newDayValues });
      }
    };

    fetch(companyId, setAccessToken, accessToken);
  }, []);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setSaleTypes({ [key]: value });
    // setData((prev) => ({ ...prev, [key]: value }));
    // setRefresh(!refresh);
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
    saleTypes,
    setSaleTypes,
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
