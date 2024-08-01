import { useState } from 'react';
import { postDuplicatedIdCheck } from '@/client/utility/apis/join/ContractAuthApi';
import useSignupInfoStore from '@/client/store/stores/useSignupInfoStore';

export const useContractAuth = ({ moveDefault }) => {
  const setSignupInfo = useSignupInfoStore((state) => state.setSignupInfo);

  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ contractAuthId: '', contractAuthPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 비밀번호 표시 여부 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // 계약 아이디 인증 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.contractAuthId && !data.contractAuthPassword) {
      setError('아이디와 비밀번호를 입력해주세요.');
    } else if (!data.contractAuthId) {
      setError('아이디를 입력해주세요.');
    } else if (!data.contractAuthPassword) {
      setError('비밀번호를 입력해주세요.');
    } else {
      setError('');
      setIsLoading(true);
      try {
        const response = await postDuplicatedIdCheck(data);
        setSignupInfo(response.data);
        moveDefault('/join/sms-auth');
      } catch (error) {
        setError('* 계약 시 알림을 통해 받은 아이디와 비밀번호를 입력해 주세요.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    data,
    showPassword,
    error,
    isLoading,
    togglePasswordVisibility,
    handleChangeInputValue,
    handleSubmit,
  };
};
