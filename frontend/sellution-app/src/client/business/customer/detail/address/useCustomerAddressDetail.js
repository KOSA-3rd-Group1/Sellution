import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import {
  getCustomerAddressDetail,
  putCustomerAddressDetail,
  deleteCustomerAddressDetail,
} from '@/client/utility/apis/customer/detail/address/customerAddressDetailApi';
import { ValidationError } from '@/client/utility/error/ValidationError';
import { validateInputPhoneNumber } from '@/client/utility/functions/validateFunction';
import {
  phoneNumberInServerFormat,
  formatPhoneNumber,
} from '@/client/utility/functions/formatterFunction';

export const useCustomerAddressDetail = ({
  moveToPathname,
  openAlertModal,
  openAutoCloseModal,
  closeAutoCloseModal,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const { customerId, addressId } = useParams();

  const [data, setData] = useState({});
  const [isChange, setIsChange] = useState(false); // 변경상태 감지
  const [refresh, setRefresh] = useState(false);
  const [confirmType, setConfirmType] = useState('moveList');

  // 서버에 데이터 요청
  useEffect(() => {
    const fetch = async (addressId, setAccessToken, accessToken) => {
      const response = await getCustomerAddressDetail(addressId, setAccessToken, accessToken);
      setData(() => ({
        ...response.data,
        phoneNumber: formatPhoneNumber(response.data.phoneNumber),
      }));
    };

    fetch(addressId, setAccessToken, accessToken);
  }, [refresh]);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    if (key === 'phoneNumber' && !validateInputPhoneNumber(value)) {
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
      if (!data.name) {
        throw ValidationError('수령인 입력은 필수입니다.');
      } else if (!data.zipcode) {
        throw ValidationError('우편번호 입력은 필수입니다.');
      } else if (!data.addressDetail) {
        throw ValidationError('상세주소 입력은 필수입니다.');
      } else if (!data.phoneNumber) {
        throw ValidationError('휴대폰 번호 입력은 필수입니다.');
      } else if (!data.addressName) {
        throw ValidationError('배송지명 입력은 필수입니다.');
      }

      const newData = { ...data, phoneNumber: phoneNumberInServerFormat(data.phoneNumber) };
      await putCustomerAddressDetail(addressId, newData, setAccessToken, accessToken);
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

  // 배송지 삭제 수행 요청
  const handleDeleteData = async () => {
    try {
      if (data.isDefaultAddress === 'Y') {
        throw ValidationError('기본 배송지는 삭제할 수 없습니다.');
      }
      await deleteCustomerAddressDetail(addressId, setAccessToken, accessToken); // 비동기 작업
      await openAutoCloseModal('배송지 삭제 성공', '작업이 성공적으로 완료되었습니다.');
    } catch (error) {
      if (error instanceof ValidationError) {
        openAlertModal('error', '오류', error.message);
      } else {
        openAlertModal('error', '오류', `${error.response.data.message}`);
        setRefresh(!refresh);
      }
    }
  };

  // 데이터 삭세 성공 시
  const scuccessCloseAutoCloseModal = () => {
    closeAutoCloseModal(moveToPathname(`/customer/${customerId}/address`));
  };

  // 목록으로 이동
  const moveList = () => {
    moveToPathname(`/customer/${customerId}/address`);
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

  // 우편 번호 찾기
  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: handlePostcodeSearchComplete,
    }).open();
  };

  // 우편 번호 찾기 완료 시
  const handlePostcodeSearchComplete = (data) => {
    setData((prev) => ({ ...prev, zipcode: data.zonecode, streetAddress: data.roadAddress }));
    setIsChange(true);
  };

  return {
    data,
    handleChangeInputValue,
    checkMoveList,
    checkSaveContent,
    checkDeleteContent,
    scuccessCloseAutoCloseModal,
    handleOnConfirm,
    handlePostcode,
  };
};
