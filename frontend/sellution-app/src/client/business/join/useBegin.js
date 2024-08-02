import useSignupInfoStore from '@/client/store/stores/useSignupInfoStore';
import { useEffect, useState } from 'react';
import {
  postDuplicatedUsernameCheck,
  postRegisterClient,
} from '@/client/utility/apis/join/BeginiApi';
import { phoneNumberInServerFormat } from '@/client/utility/functions/formatterFunction';
import { ValidationError } from '@/client/utility/error/ValidationError';

const permissions = [
  'CUSTOMER_MANAGEMENT',
  'PRODUCT_MANAGEMENT',
  'ORDER_MANAGEMENT',
  'PAYMENT_MANAGEMENT',
  'EVENT_MANAGEMENT',
  'SHOP_MANAGEMENT',
];

export const useBegin = ({ moveDefault }) => {
  const signupInfo = useSignupInfoStore((state) => ({
    companyId: state.companyId,
    businessRegistrationNumber: state.businessRegistrationNumber,
    contractCompanyName: state.contractCompanyName,
    name: state.name,
    phoneNumber: state.phoneNumber,
  }));
  const resetSignupInfo = useSignupInfoStore((state) => state.resetSignupInfo);

  const [data, setData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [usernameConfirm, setUsernameConfirm] = useState(null);
  const [usernameConfirmErrorMessage, setUsernameConfirmErrorMessage] =
    useState('이미 사용중인 아이디입니다.');
  const [passwordMatch, setPasswordMatch] = useState(null);

  useEffect(() => {
    if (signupInfo?.companyId === null) {
      moveDefault('/login');
    }

    return () => {
      resetSignupInfo();
    };
  }, []);

  useEffect(() => {
    if (data?.password.trim() !== '' && data?.confirmPassword.trim() !== '') {
      setPasswordMatch(data?.password === data?.confirmPassword);
    } else {
      setPasswordMatch(false);
    }
  }, [data.password, data.confirmPassword]);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    if (key === 'username') {
      setUsernameConfirm(null);
    }
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckIdDuplicat = async () => {
    if (data.username.trim() === '' || !/^[a-zA-Z][a-zA-Z0-9]{5,19}$/.test(data.username)) {
      setUsernameConfirmErrorMessage('유효하지 않은 아이디입니다.');
      setUsernameConfirm(false);
      return;
    }
    try {
      await postDuplicatedUsernameCheck({ username: data.username });
      setUsernameConfirm(true);
    } catch (error) {
      setUsernameConfirm(false);
      setUsernameConfirmErrorMessage('이미 사용중인 아이디입니다.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!usernameConfirm) {
        throw new ValidationError('아이디 중복 확인이 필요합니다.');
      }
      if (!passwordMatch) {
        throw new ValidationError('비밀번호가 일치하지 않습니다.');
      }
      if (data.password.length < 8) {
        throw new ValidationError('비밀번호는 8자 이상이어야 합니다.');
      }

      const updateData = {
        companyId: signupInfo.companyId,
        username: data.username,
        password: data.password,
        name: signupInfo.name,
        phoneNumber: phoneNumberInServerFormat(signupInfo.phoneNumber),
        permissions: permissions,
      };
      await postRegisterClient(updateData);
      await moveDefault('/login');
    } catch (error) {
      if (error instanceof ValidationError) {
        alert(error.message);
      } else {
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  return {
    signupInfo,
    data,
    usernameConfirm,
    usernameConfirmErrorMessage,
    passwordMatch,
    handleChangeInputValue,
    handleCheckIdDuplicat,
    handleSubmit,
  };
};
