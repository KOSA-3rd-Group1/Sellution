import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import { postCustomerPaymentAdd } from '@/client/utility/apis/customer/detail/payment/customerPaymentAddApi';
import { ValidationError } from '@/client/utility/error/ValidationError';
import { validateInputAccountNumber } from '@/client/utility/functions/validateFunction';
import { accountNumberInServerFormat } from '@/client/utility/functions/formatterFunction';

export const useCustomerPaymentAdd = ({
  moveToPathname,
  openAlertModal,
  openAutoCloseModal,
  closeAutoCloseModal,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const { customerId } = useParams();
  const [paymentId, setPaymentId] = useState();

  const [data, setData] = useState({ paymentMethod: 'CMS' });
  const [isChange, setIsChange] = useState(false);
  const [confirmType, setConfirmType] = useState('moveList');

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    if (key == 'accountNumber' && !validateInputAccountNumber(value)) {
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
      if (!data.accountNumber) {
        throw ValidationError('계좌 번호가 필요합니다.');
      }
      if (!data.bank) {
        throw ValidationError('은행 정보가 필요합니다.');
      }
      const newData = {
        accountNumber: accountNumberInServerFormat(data.accountNumber),
        bankCode: data.bank,
      };
      const response = await postCustomerPaymentAdd(
        customerId,
        newData,
        setAccessToken,
        accessToken,
      );

      setPaymentId(response.data.split(':')[1].trim());
      await openAutoCloseModal('결제 수단 등록 성공', '작업이 성공적으로 완료되었습니다.');
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
    closeAutoCloseModal(moveToPathname(`/customer/${customerId}/payment/${paymentId}`));
  };

  // 목록으로 이동
  const moveList = () => {
    moveToPathname(`/customer/${customerId}/payment`);
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
