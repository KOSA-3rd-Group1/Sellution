import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import {
  getCustomerDefault,
  putCustomerDefault,
} from '@/client/utility/apis/customer/detail/customerDefaultApi';

// const DUMMY = {
//   name: '테스트회원명',
//   username: 'testuser1234',
//   phoneNumber: '01012345678',
//   createdAt: '2024-07-17',
//   type: '휴면',
//   isInUse: '미이용중',
// };

export const useCustomerDefault = ({
  moveToPathname,
  moveToDefaultPath,
  openAlertModal,
  openAutoCloseModal,
  closeAutoCloseModal,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const { customerId } = useParams();

  const [data, setData] = useState({});
  const [isChange, setIsChange] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // 서버에 데이터 요청
  useEffect(() => {
    const fetch = async (customerId) => {
      const response = await getCustomerDefault(customerId);
      setData(() => ({ ...response.data }));
    };
    fetch(customerId);
  }, [refresh]);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    if (key === 'customerPhoneNumber' && !/^\d*$/.test(value)) {
      return;
    }
    setData((prev) => ({ ...prev, [key]: value }));
    if (!isChange) setIsChange(true);
  };

  // 변경사항 확인 후
  const checkChangeContent = () => {
    if (isChange) {
      openAlertModal('warning', '주의', '변경 사항이 저장되지 않았습니다. 계속하시겠습니까?');
    } else {
      moveList();
    }
  };

  // 목록으로 이동 또는 경고 로직 수행
  const moveList = () => {
    moveToPathname('/customer');
  };

  // 변경사항 적용
  const handleSaveData = async () => {
    // 변경된 사항이 없으면 따로 서버에 요청하지 않음
    if (!isChange) {
      openAlertModal('success', '성공', '변경사항이 성공적으로 적용되었습니다.');
      return;
    }

    try {
      await putCustomerDefault(
        customerId,
        data.customerName,
        data.customerPhoneNumber,
        setAccessToken,
        accessToken,
      );
      setIsChange(false);
      openAlertModal('success', '성공', '변경사항이 성공적으로 적용되었습니다.');
    } catch (error) {
      openAlertModal('error', '오류', `${error.response.data.message}`);
      setRefresh(!refresh);
    }
  };

  // 회원 삭제 - 현재 미구현 상태
  const handleDeleteData = () => {
    alert('회원 삭제');
    moveToDefaultPath('/customer');
  };

  return {
    data,
    handleChangeInputValue,
    moveList,
    handleSaveData,
    handleDeleteData,
    checkChangeContent,
  };
};
