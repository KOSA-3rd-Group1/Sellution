import { useState } from 'react';
import useAuthStore from '@/client/store/stores/useAuthStore';
import { postCustomerAdd } from '@/client/utility/apis/customer/customerAddApi';
import { getCurrentDate } from '@/client/utility/functions/customerAddFunction';

export const useCustomerAdd = ({
  moveToPathname,
  moveToDefaultPath,
  openAlertModal,
  openAutoCloseModal,
  closeAutoCloseModal,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [data, setData] = useState({ createdAt: getCurrentDate() });
  const [customerId, setCustomerId] = useState();

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    if (key === 'phoneNumber' && !/^\d*$/.test(value)) {
      return;
    }
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // 목록으로 이동
  const moveList = () => {
    moveToPathname('/customer');
  };

  // 변경사항 적용
  const handleSaveData = async () => {
    try {
      const response = await postCustomerAdd(
        data.name,
        data.phoneNumber,
        setAccessToken,
        accessToken,
      );
      setCustomerId(response.data.customerId);
      await openAutoCloseModal('회원 등록 성공', '작업이 성공적으로 완료되었습니다.');
    } catch (error) {
      openAlertModal('error', '오류', `${error.response.data.message}`);
    }
  };

  // 변경사항 성공 시 성공 모달
  const scuccessCloseAutoCloseModal = () => {
    closeAutoCloseModal(moveToDefaultPath(`/customer/${customerId}/default`));
  };

  return {
    data,
    handleChangeInputValue,
    moveList,
    handleSaveData,
    scuccessCloseAutoCloseModal,
  };
};
