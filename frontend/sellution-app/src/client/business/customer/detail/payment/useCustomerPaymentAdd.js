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

  const [isLoading, setIsLoading] = useState(false);

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

      setIsLoading(true); // 로딩 상태 시작
      const startTime = Date.now();

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

      await Promise.all([
        response,
        new Promise((resolve) => setTimeout(resolve, 1000)), // 최소 1초 대기
      ]);

      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      if (elapsedTime < 1000) {
        // 1초 미만으로 걸렸다면, 남은 시간만큼 더 대기
        await new Promise((resolve) => setTimeout(resolve, 1000 - elapsedTime));
      }

      setIsLoading(false);
      setPaymentId(response.data.split(':')[1].trim());
      openAutoCloseModal('결제 수단 등록 성공', '작업이 성공적으로 완료되었습니다.');
    } catch (error) {
      setIsLoading(false);
      if (error instanceof ValidationError) {
        openAlertModal('error', '오류', error.message);
      } else {
        openAlertModal(
          'error',
          '오류',
          `${error.response.data.message}` ||
            '알 수 없는 오류가 발생했습니다. 반복적으로 문제가 발생하는 경우, 지원팀에 문의해 주세요.',
        );
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
    isLoading,
    handleChangeInputValue,
    checkMoveList,
    checkSaveContent,
    scuccessCloseAutoCloseModal,
    handleOnConfirm,
  };
};
