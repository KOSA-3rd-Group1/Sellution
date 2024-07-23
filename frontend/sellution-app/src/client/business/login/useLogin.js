import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useLogin = ({ login }) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 비밀번호 표시 여부 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 로그인 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username && !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
    } else if (!username) {
      setError('아이디를 입력해주세요.');
    } else if (!password) {
      setError('비밀번호를 입력해주세요.');
    } else {
      setError('');
      setIsLoading(true);
      try {
        const success = await login(username, password);
        if (success) {
          navigate('/home'); // 로그인 성공 시 홈으로 이동
        } else {
          setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
        }
      } catch (error) {
        setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    username,
    password,
    showPassword,
    error,
    isLoading,
    setUsername,
    setPassword,
    togglePasswordVisibility,
    handleSubmit,
  };
};
