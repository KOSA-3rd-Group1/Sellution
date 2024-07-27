import { useState } from 'react';
import useAuthStore from '@/client/store/stores/useAuthStore';
import { postCustomerAdd } from '@/client/utility/apis/customer/customerAddApi';
import { getCurrentDate } from '@/client/utility/functions/customerAddFunction';
import { ValidationError } from '@/client/utility/error/ValidationError';
import { validateInputPhoneNumber } from '@/client/utility/functions/validateFunction';
import { phoneNumberInServerFormat } from '@/client/utility/functions/formatterFunction';

export const useCustomerAdd = ({
  moveToPathname,
  moveToDefaultPath,
  openAlertModal,
  openAutoCloseModal,
  closeAutoCloseModal,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [customerId, setCustomerId] = useState();

  const [data, setData] = useState({ createdAt: getCurrentDate() });
  const [isChange, setIsChange] = useState(false);
  const [confirmType, setConfirmType] = useState('moveList');

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    if (key === 'phoneNumber' && !validateInputPhoneNumber(value)) {
      return;
    }
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

  // 작성사항 등록
  const handleSaveData = async () => {
    try {
      if (!data.name) {
        throw ValidationError('회원명 입력은 필수입니다.');
      }
      if (!data.phoneNumber) {
        throw ValidationError('휴대폰 번호 입력은 필요합니다.');
      }
      const response = await postCustomerAdd(
        data.name,
        phoneNumberInServerFormat(data.phoneNumber),
        setAccessToken,
        accessToken,
      );
      setCustomerId(response.data.customerId);
      await openAutoCloseModal('회원 등록 성공', '작업이 성공적으로 완료되었습니다.');
    } catch (error) {
      if (error instanceof ValidationError) {
        openAlertModal('error', '오류', error.message);
      } else {
        openAlertModal('error', '오류', `${error.response.data.message}`);
      }
    }
  };

  // 변경사항 성공 시 성공 모달
  const scuccessCloseAutoCloseModal = () => {
    closeAutoCloseModal(moveToDefaultPath(`/customer/${customerId}/default`));
  };

  // 목록으로 이동
  const moveList = () => {
    moveToPathname('/customer');
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

  return {
    data,
    handleChangeInputValue,
    checkMoveList,
    checkSaveContent,
    scuccessCloseAutoCloseModal,
    handleOnConfirm,
  };
};
