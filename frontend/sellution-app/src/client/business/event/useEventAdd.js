import { useState } from 'react';
import useAuthStore from '@/client/store/stores/useAuthStore';
import { transformOrderType } from '@/client/utility/functions/eventAddFunction';
import { postEventAdd } from '@/client/utility/apis/event/eventAddApi';

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

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
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
    const addData = {
      ...data,
      targetCustomerType: transformOrderType(selectedTargetCustomerType),
    };
    const response = await postEventAdd(addData, setAccessToken, accessToken);
    //   setEventId(response.data);
    await openAutoCloseModal('배송지 등록 성공', '작업이 성공적으로 완료되었습니다.');
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
