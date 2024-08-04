import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import {
  getCustomerDefault,
  putCustomerDefault,
} from '@/client/utility/apis/customer/detail/customerDefaultApi';
import { ValidationError } from '@/client/utility/error/ValidationError';
import { validateInputAccountNumber } from '@/client/utility/functions/validateFunction';
import {
  phoneNumberInServerFormat,
  formatPhoneNumber,
} from '@/client/utility/functions/formatterFunction';
import { formatCustomerType } from '@/client/utility/functions/customerListFunction';

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
  const [confirmType, setConfirmType] = useState('moveList');

  // 서버에 데이터 요청
  useEffect(() => {
    const fetch = async (customerId, setAccessToken, accessToken) => {
      const response = await getCustomerDefault(customerId, setAccessToken, accessToken);
      setData(() => ({
        ...response.data,
        customerType: formatCustomerType(response.data.customerType),
        customerPhoneNumber: formatPhoneNumber(response.data.customerPhoneNumber),
      }));
    };

    fetch(customerId, setAccessToken, accessToken);
  }, [refresh]);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    if (key === 'customerPhoneNumber' && !validateInputAccountNumber(value)) {
      return;
    }
    setData((prev) => ({ ...prev, [key]: value }));
    if (!isChange) setIsChange(true);
  };

  // 목록으로 이동 전 변경사항 저장 확인
  const checkMoveList = () => {
    if (isChange) {
      setConfirmType('moveList');
      openAlertModal('warning', '주의', '변경 사항이 저장되지 않았습니다. 계속하시겠습니까?');
    } else {
      moveList();
    }
  };

  // 변경사항 적용 여부 확인
  const checkSaveContent = () => {
    if (isChange) {
      setConfirmType('saveContent');
      openAlertModal('warning', '주의', '변경사항을 적용하시겠습니까?');
    } else {
      openAlertModal('success', '성공', '변경사항이 없습니다.');
    }
  };

  // 삭제 여부 확인
  const checkDeleteContent = () => {
    setConfirmType('deleteContent');
    openAlertModal('warning', '주의', '삭제된 정보는 복구되지 않습니다. 계속하시겠습니까?');
  };

  // 변경사항 적용
  const handleSaveData = async () => {
    try {
      if (!data.customerName) {
        throw ValidationError('회원명 입력은 필수입니다.');
      }
      if (!data.customerPhoneNumber) {
        throw ValidationError('휴대폰 번호 입력은 필수입니다.');
      }

      await putCustomerDefault(
        customerId,
        data.customerName,
        phoneNumberInServerFormat(data.customerPhoneNumber),
        setAccessToken,
        accessToken,
      );
      await openAlertModal('success', '성공', '변경사항이 성공적으로 적용되었습니다.');
      setIsChange(false);
      setRefresh(!refresh);
    } catch (error) {
      if (error instanceof ValidationError) {
        openAlertModal('error', '오류', error.message);
      } else {
        openAlertModal('error', '오류', `${error.response.data.message}`);
      }
      setIsChange(false);
      setRefresh(!refresh);
    }
  };

  // 회원 삭제 - 현재 미구현 상태
  const handleDeleteData = async () => {
    try {
      // 비동기 요청
      await openAutoCloseModal('회원 삭제 성공', '작업이 성공적으로 완료되었습니다.');
    } catch (error) {
      openAlertModal('error', '오류', `회원 삭제 작업이 실패하였습니다`);
    }
  };

  // 데이터 삭세 성공 시
  const scuccessCloseAutoCloseModal = () => {
    closeAutoCloseModal(moveToDefaultPath('/customer'));
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
      case 'deleteContent':
        handleDeleteData();
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
    checkDeleteContent,
    scuccessCloseAutoCloseModal,
    handleOnConfirm,
  };
};
