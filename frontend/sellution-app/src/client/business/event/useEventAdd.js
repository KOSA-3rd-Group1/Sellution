import { useState } from 'react';
import useAuthStore from '@/client/store/stores/useAuthStore';
import { transformOrderType } from '@/client/utility/functions/eventAddFunction';
import { postEventAdd } from '@/client/utility/apis/event/eventAddApi';
import { ValidationError } from '@/client/utility/error/ValidationError';
import { validateInputNumber } from '@/client/utility/functions/validateFunction';

const selectTargetCustomerType = [
  { value: '0', label: '전체' },
  { value: '1', label: '신규' },
  { value: '2', label: '일반' },
  { value: '3', label: '휴면' },
];

export const useEventAdd = ({
  moveToPathname,
  openAlertModal,
  openAutoCloseModal,
  closeAutoCloseModal,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  //   const [eventId, setEventId] = useState();

  const [data, setData] = useState({});
  const [selectedTargetCustomerType, setSelectedTargetCustomerType] = useState();
  const [isChange, setIsChange] = useState(false);
  const [confirmType, setConfirmType] = useState('moveList');
  console.log(selectedTargetCustomerType);
  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    if (key === 'totalQuantity' && !validateInputNumber(value)) return;
    if (key === 'couponDiscountRate' && !validateInputNumber(value)) return;

    setData((prev) => ({ ...prev, [key]: value }));
    if (!isChange) setIsChange(true);
  };

  // 목록으로 이동 여부 확인
  const checkMoveList = () => {
    if (isChange) {
      setConfirmType('moveList');
      openAlertModal(
        'warning',
        '주의',
        '작성한 내용은 저장되지 않습니다. 등록을 취소하시겠습니까?',
      );
    } else {
      moveList();
    }
  };

  // 작성사항 등록 여부 확인
  const checkSaveContent = () => {
    if (isChange) {
      setConfirmType('saveContent');
      openAlertModal('warning', '주의', '작성한 내용으로 등록하시겠습니까?');
    } else {
      openAlertModal('error', '오류', '작성한 내용이 없습니다.');
    }
  };

  // 변경사항 적용
  const handleSaveData = async () => {
    try {
      // 모든 필드가 존재하는지 확인
      const requiredFields = {
        couponName: '쿠폰 이름',
        couponDiscountRate: '할인율',
        totalQuantity: '수량',
        eventStartDate: '이벤트 시작일',
        eventEndDate: '이벤트 종료일',
      };

      // 모든 필드가 존재하는지 확인
      for (const [key, value] of Object.entries(requiredFields)) {
        if (!data[key]) {
          throw new ValidationError(`${value} 입력은 필수입니다.`);
        }
      }

      if (!selectedTargetCustomerType) {
        throw new ValidationError(`적용 회원 선택은 필수입니다.`);
      }

      // couponDiscountRate가 숫자인지 확인
      if (isNaN(Number(data.couponDiscountRate))) {
        throw new ValidationError('쿠폰 할인율은 숫자여야 합니다.');
      }

      // totalQuantity가 숫자인지 확인
      if (isNaN(Number(data.totalQuantity))) {
        throw new ValidationError('총 수량은 숫자여야 합니다.');
      }

      // 날짜 유효성 검사
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(data.eventStartDate);
      const endDate = new Date(data.eventEndDate);

      if (startDate < today) {
        throw new ValidationError('이벤트 시작일은 당일부터 가능합니다.');
      }

      if (endDate < startDate) {
        throw new ValidationError('이벤트 종료일은 이벤트 시작일부터 가능합니다');
      }

      const addData = {
        ...data,
        targetCustomerType: transformOrderType(selectedTargetCustomerType),
      };
      const response = await postEventAdd(addData, setAccessToken, accessToken);
      //   console.log(response);
      //   setEventId(response.data);
      await openAutoCloseModal('이벤트 등록 성공', '작업이 성공적으로 완료되었습니다.');
    } catch (error) {
      if (error instanceof ValidationError) {
        openAlertModal('error', '오류', error.message);
      } else {
        openAlertModal(
          'error',
          '오류',
          `${error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'}`,
        );
      }
    }
  };

  // 변경사항 성공 시 성공 모달
  const scuccessCloseAutoCloseModal = () => {
    closeAutoCloseModal(moveToPathname(`/event`));
    // closeAutoCloseModal(moveToPathname(`/event/${eventId}`));
  };

  // 목록으로 이동
  const moveList = () => {
    moveToPathname(`/event`);
  };

  // handle onConfirm
  const handleOnConfirm = () => {
    switch (confirmType) {
      case 'saveContent':
        handleSaveData();
        break;
      case 'moveList':
      default:
        moveList();
        break;
    }
  };

  // 적용 회원 변경
  const handleChangeSelectedTargetCustomerType = (selectedOption) => {
    setSelectedTargetCustomerType(selectedOption);
  };

  return {
    data,
    selectTargetCustomerType,
    selectedTargetCustomerType,
    handleChangeInputValue,
    handleChangeSelectedTargetCustomerType,
    checkMoveList,
    checkSaveContent,
    scuccessCloseAutoCloseModal,
    handleOnConfirm,
  };
};
