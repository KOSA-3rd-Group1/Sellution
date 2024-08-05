import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import {
  deleteEventDetail,
  getEventDetail,
  putEventDetail,
} from '@/client/utility/apis/event/eventDetailApi';
import { ValidationError } from '@/client/utility/error/ValidationError';
import { formatTargetCustomerType } from '@/client/utility/functions/eventListFunction';

export const useEventDetail = ({
  moveToPathname,
  moveToDefaultPath,
  openAlertModal,
  openAutoCloseModal,
  closeAutoCloseModal,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const { eventId } = useParams();

  const [data, setData] = useState({});
  const [isChange, setIsChange] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [confirmType, setConfirmType] = useState('moveList');

  // 서버에 데이터 요청
  useEffect(() => {
    const fetch = async (eventId, setAccessToken, accessToken) => {
      const response = await getEventDetail(eventId, setAccessToken, accessToken);
      setData(() => ({
        ...response.data,
        targetCustomerType: formatTargetCustomerType(response.data.targetCustomerType),
      }));
    };

    fetch(eventId, setAccessToken, accessToken);
  }, [refresh]);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
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
      if (!data.couponName) {
        throw ValidationError('쿠폰 이름 입력은 필수입니다.');
      } else if (!data.eventEndDate) {
        throw ValidationError('이벤트 적용 기간 종료 일자 입력은 필수입니다.');
      }

      const updateData = {
        couponName: data.couponName,
        eventEndDate: data.eventEndDate,
      };
      await putEventDetail(eventId, updateData, setAccessToken, accessToken);

      setIsChange(false);
      openAlertModal('success', '성공', '변경사항이 성공적으로 적용되었습니다.');
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

  // 이벤트 삭제
  const handleDeleteData = async () => {
    try {
      await deleteEventDetail(eventId, setAccessToken, accessToken);
      await openAutoCloseModal('이벤트 삭제 성공', '작업이 성공적으로 완료되었습니다.');
    } catch (error) {
      openAlertModal('error', '오류', `${error.response.data.message}`);
      setRefresh(!refresh);
    }
  };

  // 데이터 삭세 성공 시
  const scuccessCloseAutoCloseModal = () => {
    closeAutoCloseModal(moveToDefaultPath('/event'));
  };

  // 목록으로 이동
  const moveList = () => {
    moveToPathname('/event');
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
