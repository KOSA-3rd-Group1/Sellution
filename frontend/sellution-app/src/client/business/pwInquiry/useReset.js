import { useEffect, useState } from 'react';
import { postChangePassword } from '@/client/utility/apis/pwInquiry/ResetApi';

export const useReset = ({
  queryParams,
  moveDefault,
  openAlertModal,
  openAutoCloseModal,
  closeAutoCloseModal,
}) => {
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
    try {
      if (passwordMatch) {
        console.log('비밀번호 변경 완료');
        const updateData = { token: queryParams.get('token'), newPassword: data.password };
        await postChangePassword(updateData);
        await openAutoCloseModal('비밀번호 변경 성공', '비밀번호가 성공적으로 변경되었습니다.');
        //   moveDefault('/login');
      }
    } catch (error) {
      openAlertModal(
        'error',
        '오류',
        `${error.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다. 처음 화면부터 다시 시도해 주세요'}`,
      );
    }
  };

  // 비밀번호 변경 성공 시
  const scuccessCloseAutoCloseModal = () => {
    closeAutoCloseModal(moveDefault('/login'));
  };

  return { data, passwordMatch, handleChangeInputValue, handleSubmit, scuccessCloseAutoCloseModal };
};
