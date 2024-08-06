import { useEffect, useState } from 'react';
import useAuthStore from '@/client/store/stores/useAuthStore';
import useUserInfoStore from '@/client/store/stores/useUserInfoStore';
import useSaleSettingStore from '@/client/store/stores/useSaleSettingStore';
import { ValidationError } from '@/client/utility/error/ValidationError';
import {
  getSaleSetting,
  putSaleSetting,
  getAllCatogory,
  getAllProduct,
} from '@/client/utility/apis/shopManagement/shopManagementSaleSettingApi';
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
  tranformSelectedOptions,
  transformDayValues,
  transformSellType,
  transformSubscriptionType,
  transformWeekValues,
} from '@/client/utility/functions/shopManagementSaleSettingFunction';

// 더미 데이터 생성 함수
// const generateEachProductDummyData = (count) => {
//   return Array.from({ length: count }, (_, index) => ({
//     value: index + 1,
//     code: `${Math.floor(100000 + Math.random() * 900000)}`,
//     label: `상품${Math.floor(100000 + Math.random() * 900000)}`,
//     categoryName: ['과일', '야채', '유기농', '건조', '동결건조', '카테고리 미설정'][
//       Math.floor(Math.random() * 6)
//     ],
//     cost: `${Math.floor(10 + Math.random() * 90)}000`,
//     group: ['과일', '야채', '유기농', '건조', '동결건조', '카테고리 미설정'][
//       Math.floor(Math.random() * 6)
//     ],
//   }));
// };

// const DUMMY = {
//   category: [
//     { value: '1', label: '과일' },
//     { value: '2', label: '야채' },
//     { value: '3', label: '유기농' },
//     { value: '4', label: '건조' },
//     { value: '5', label: '동결건조' },
//   ],
// };
export const useShopManagementSaleSetting = ({ openAlertModal }) => {
  const { accessToken, setAccessToken } = useAuthStore((state) => ({
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
  }));

  const companyId = useUserInfoStore((state) => state.companyId);

  const {
    saleTypes,
    sellTypeCategory,
    sellTypeEach,
    subscriptionTypeMonth,
    subscriptionTypeCount,
    setSaleTypes,
    setSellTypeCategory,
    setSellTypeEach,
    setSubscriptionTypeMonth,
    setSubscriptionTypeCount,
  } = useSaleSettingStore();
  //   const [isChange, setIsChange] = useState(false); // 변경상태 감지
  const [refresh, setRefresh] = useState(false);
  const [confirmType, setConfirmType] = useState('resetContent');

  const [isLoading, setIsLoading] = useState(false);

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
      setSellTypeEach({
        selectBothOptions: newSelectEachProductOptions.BOTH,
        selectOnetimeOptions: newSelectEachProductOptions.ONETIME,
        selectSubscriptionOptions: newSelectEachProductOptions.SUBSCRIPTION,
      });

      // 판매 설정 데이터 조회
      const response = await getSaleSetting(companyId, setAccessToken, accessToken);
      //   console.log(response);

      // 배송 유형 (ONETIME, SUBSCRIPTION, BOTH)
      setSaleTypes({ serviceType: response.data.serviceType });

      // 적용 상품 (ALL: 0, CATEGORY: 1, EACH: 2)
      setSaleTypes({ sellType: formatSellType(response.data.sellType) });

      // 정기 배송 유형 (MONTH: 0, COUNT: 1)
      setSaleTypes({ subscriptionType: formatSubscriptionType(response.data.subscriptionType) });

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
          response.data.productIds,
          newSelectEachProductOptions[response.data.serviceType],
        );
        setSellTypeEach({ selectedOptions: newSelectedEachProductOptions });
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
  }, [refresh]);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setSaleTypes({ [key]: value });
    setSellTypeEach({ selectedOptions: [] });
  };

  // 초기화 여부 확인
  const checkResetContent = () => {
    setConfirmType('resetContent');
    openAlertModal('warning', '주의', '변경 사항이 저장되지 않았습니다. 계속하시겠습니까?');
  };

  // 변경사항 적용 여부 확인
  const checkSaveContent = () => {
    setConfirmType('saveContent');
    openAlertModal('warning', '주의', '변경사항을 적용하시겠습니까?');
  };

  // 변경 사항 초기화
  const handleResetData = () => {
    openAlertModal('success', '성공', '작업이 성공적으로 완료되었습니다.');
    setRefresh(!refresh);
  };

  // 등록
  const handleSaveData = async () => {
    try {
      setIsLoading(true);
      const startTime = Date.now();

      const updateData = {
        companyId,
        serviceType: saleTypes.serviceType,
        sellType: transformSellType(saleTypes.sellType),
        categories: null,
        products: null,
        subscriptionType: 'MONTH',
        monthOptions: [],
        weekOptions: [],
        dayOptions: [],
        minDeliveryCount: 5,
        maxDeliveryCount: 30,
      };

      if (updateData.sellType === 'CATEGORY') {
        if (!sellTypeCategory.selectedOptions || sellTypeCategory.selectedOptions.length === 0) {
          throw new ValidationError('카테고리를 하나 이상 선택해주세요.');
        }
        updateData.categories = tranformSelectedOptions(sellTypeCategory.selectedOptions);
      } else if (updateData.sellType === 'EACH') {
        if (!sellTypeEach.selectedOptions || sellTypeEach.selectedOptions.length === 0) {
          throw new ValidationError('상품을 하나 이상 선택해주세요.');
        }
        updateData.products = tranformSelectedOptions(sellTypeEach.selectedOptions);
      }

      if (saleTypes.serviceType !== 'ONETIME') {
        if (saleTypes.subscriptionType === undefined) {
          throw new ValidationError('정기 배송 유형을 선택해주세요.');
        }

        // 월 단위 결제
        if (saleTypes.subscriptionType == 0) {
          updateData.subscriptionType = transformSubscriptionType(saleTypes.subscriptionType);

          if (
            !subscriptionTypeMonth.selectedMonthOptions ||
            subscriptionTypeMonth.selectedMonthOptions.length === 0
          ) {
            throw new ValidationError('이용 기간을 하나 이상 선택해주세요.');
          }
          updateData.monthOptions = tranformSelectedOptions(
            subscriptionTypeMonth.selectedMonthOptions,
          );

          const updateWeekOptions = transformWeekValues(subscriptionTypeMonth.weekValues);
          if (!updateWeekOptions || updateWeekOptions.length === 0) {
            throw new ValidationError('배송 주기 옵션을 하나 이상 선택해주세요.');
          }
          updateData.weekOptions = updateWeekOptions;

          const updateDayOptions = transformDayValues(subscriptionTypeMonth.dayValues);
          if (!updateDayOptions || updateDayOptions.length === 0) {
            throw new ValidationError('배송 가능 요일 옵션을 하나 이상 선택해주세요.');
          }
          updateData.dayOptions = updateDayOptions;
        }

        // 횟수 단위 결제
        if (saleTypes.subscriptionType === 1) {
          updateData.subscriptionType = transformSubscriptionType(saleTypes.subscriptionType);

          if (
            subscriptionTypeCount.minDeliveryCount === undefined ||
            subscriptionTypeCount.minDeliveryCount < 5
          ) {
            throw new ValidationError('최소 이용 횟수를 5 이상으로 입력해주세요.');
          }
          updateData.minDeliveryCount = subscriptionTypeCount.minDeliveryCount;

          if (
            subscriptionTypeCount.maxDeliveryCount === undefined ||
            subscriptionTypeCount.maxDeliveryCount < subscriptionTypeCount.minDeliveryCount
          ) {
            throw new ValidationError('최대 이용 횟수는 최소 이용 횟수보다 커야 합니다.');
          }
          updateData.maxDeliveryCount = subscriptionTypeCount.maxDeliveryCount;

          const updateWeekOptions = transformWeekValues(subscriptionTypeCount.weekValues);
          if (!updateWeekOptions || updateWeekOptions.length === 0) {
            throw new ValidationError('배송 주기 옵션을 하나 이상 선택해주세요.');
          }
          updateData.weekOptions = updateWeekOptions;

          const updateDayOptions = transformDayValues(subscriptionTypeCount.dayValues);
          if (!updateDayOptions || updateDayOptions.length === 0) {
            throw new ValidationError('배송 가능 요일 옵션을 하나 이상 선택해주세요.');
          }
          updateData.dayOptions = updateDayOptions;
        }
      }

      const approvePromise = await putSaleSetting(updateData, setAccessToken, accessToken);
      await Promise.all([
        approvePromise,
        new Promise((resolve) => setTimeout(resolve, 1000)), // 최소 1초 대기
      ]);

      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      if (elapsedTime < 1000) {
        // 1초 미만으로 걸렸다면, 남은 시간만큼 더 대기
        await new Promise((resolve) => setTimeout(resolve, 1000 - elapsedTime));
      }
      setIsLoading(false);
      setRefresh(!refresh);

      openAlertModal('success', '성공', '변경사항이 성공적으로 적용되었습니다.');
    } catch (error) {
      setIsLoading(false);
      if (error instanceof ValidationError) {
        openAlertModal('error', '입력 오류', error.message);
      } else {
        openAlertModal(
          'error',
          '오류',
          `${error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'}`,
        );
      }
      setRefresh(!refresh);
    }
  };

  // handle onConfirm
  const handleOnConfirm = () => {
    switch (confirmType) {
      case 'saveContent':
        handleSaveData();
        break;
      case 'resetContent':
      default:
        handleResetData();
        break;
    }
  };

  return {
    saleTypes,
    isLoading,
    handleChangeInputValue,
    handleSaveData,
    checkResetContent,
    checkSaveContent,
    handleOnConfirm,
  };
};
