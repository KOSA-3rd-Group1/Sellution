import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import { postCustomerAddressAdd } from '@/client/utility/apis/customer/detail/address/customerAddressAddApi';
import { ValidationError } from '@/client/utility/error/ValidationError';
import { validateInputPhoneNumber } from '@/client/utility/functions/validateFunction';
import { phoneNumberInServerFormat } from '@/client/utility/functions/formatterFunction';

export const useCustomerAddressAdd = ({
  moveToPathname,
  openAlertModal,
  openAutoCloseModal,
  closeAutoCloseModal,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const { customerId } = useParams();
  const [addressId, setAddressId] = useState();

  const [data, setData] = useState({});
  const [isChange, setIsChange] = useState(false);
  const [confirmType, setConfirmType] = useState('moveList');

  const [isLoading, setIsLoading] = useState(false);

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

  // 작성사항 적용
  const handleSaveData = async () => {
    try {
      if (!data.name) {
        throw ValidationError('수령인 입력은 필수입니다.');
      } else if (!data.zipcode) {
        throw ValidationError('우편번호 입력은 필수입니다.');
      } else if (!data.addressDetail) {
        throw ValidationError('상세주소 입력은 필수입니다.');
      } else if (!data.phoneNumber) {
        throw ValidationError('후대폰 번호 입력은 필수입니다.');
      } else if (!data.addressName) {
        throw ValidationError('배송지명 입력은 필수입니다.');
      }

      const newData = {
        ...data,
        customerId: customerId,
        phoneNumber: phoneNumberInServerFormat(data.phoneNumber),
        isDefaultAddress: 'N',
      };
      const response = await postCustomerAddressAdd(newData, setAccessToken, accessToken);
      setAddressId(response.data);
      await openAutoCloseModal('배송지 등록 성공', '작업이 성공적으로 완료되었습니다.');
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
    closeAutoCloseModal(moveToPathname(`/customer/${customerId}/address/${addressId}`));
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
    isLoading,
    handleChangeInputValue,
    checkMoveList,
    checkSaveContent,
    scuccessCloseAutoCloseModal,
    handleOnConfirm,
    handlePostcode,
  };
};
