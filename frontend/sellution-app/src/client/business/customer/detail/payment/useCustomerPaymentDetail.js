import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import {
  getCustomerPaymentDetail,
  deleteCustomerPaymentDetail,
} from '@/client/utility/apis/customer/detail/payment/customerPaymentDetailApi';
import { bankCodeIndexInfo } from '@/client/utility/bank/bankInfo';

export const useCustomerPaymentDetail = ({
  moveToPathname,
  openAlertModal,
  openAutoCloseModal,
  closeAutoCloseModal,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const { customerId, paymentId } = useParams();

  const [data, setData] = useState({});
  const [bankCodeIndex, setBankCodeIndex] = useState();
  const [confirmType, setConfirmType] = useState('moveList');

  const formatData = useCallback(
    (content) => ({
      ...content,
      paymentMethod: `CMS`,
      id: content.accountId,
      createdAt: content.createdAt.split('T')[0],
    }),
    [],
  );

  // 서버에 데이터 요청
  useEffect(() => {
    const fetch = async (paymentId, setAccessToken, accessToken) => {
      const response = await getCustomerPaymentDetail(paymentId, setAccessToken, accessToken);
      const formattedContent = formatData(response.data);
      setData(() => formattedContent);
      setBankCodeIndex(bankCodeIndexInfo[response.data.bankCode].index);
    };

    fetch(paymentId, setAccessToken, accessToken);
  }, []);

  // 목록으로 이동 전 변경사항 저장 확인
  const checkMoveList = () => {
    moveList();
  };

  // 삭제 여부 확인
  const checkDeleteContent = () => {
    setConfirmType('deleteContent');
    openAlertModal('warning', '주의', '삭제된 정보는 복구되지 않습니다. 계속하시겠습니까?');
  };

  // 데이터 삭제 수행 요청
  const handleDeleteData = async () => {
    try {
      await deleteCustomerPaymentDetail(paymentId, setAccessToken, accessToken); // 비동기 작업
      await openAutoCloseModal('결제 수단 삭제 성공', '작업이 성공적으로 완료되었습니다.');
    } catch (error) {
      openAlertModal('error', '오류', `결제 수단 삭제 작업이 실패하였습니다`);
    }
  };

  // 데이터 삭세 성공 시
  const scuccessCloseAutoCloseModal = () => {
    closeAutoCloseModal(moveToPathname(`/customer/${customerId}/payment`));
  };

  // 목록으로 이동
  const moveList = () => {
    moveToPathname(`/customer/${customerId}/payment`);
  };

  // handle onConfirm
  const handleOnConfirm = () => {
    switch (confirmType) {
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
    bankCodeIndex,
    checkMoveList,
    checkDeleteContent,
    scuccessCloseAutoCloseModal,
    handleOnConfirm,
  };
};
