import { useEffect, useState } from 'react';
import { postChangePassword } from '@/client/utility/apis/pwInquiry/ResetApi';

export const useReset = ({ queryParams, moveDefault }) => {
  const [data, setData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [passwordMatch, setPasswordMatch] = useState(null);

  useEffect(() => {
    if (data?.password.trim() !== '' && data?.confirmPassword.trim() !== '') {
      setPasswordMatch(data?.password === data?.confirmPassword);
    } else {
      setPasswordMatch(false);
    }
  }, [data.password, data.confirmPassword]);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordMatch) {
      console.log('비밀번호 변경 완료');
      const updateData = { token: queryParams.get('token'), newPassword: data.password };
      await postChangePassword(updateData);
      moveDefault('/login');
    }
  };

  return { data, passwordMatch, handleChangeInputValue, handleSubmit };
};
