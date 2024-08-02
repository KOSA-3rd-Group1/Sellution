import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useAuthStore from '@/shopping/store/stores/useAuthStore';
import useUserInfoStore from '@/shopping/store/stores/useUserInfoStore';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import { login } from '@/shopping/utility/apis/login/loginApi';

export const useLogin = ({ moveDefault }) => {
  //   const navigate = useNavigate();
  const { clientName } = useParams(); // url 상 clientName <- 회사명
  const location = useLocation();

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setAllUserData = useUserInfoStore((state) => state.setAllUserData);
  //local에 저장된 회사명, 회사 id
  const { name, companyId } = useCompanyInfoStore((state) => ({
    name: state.name,
    companyId: state.companyId,
  }));

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
        const success = await login(username, password, companyId, setAccessToken, setAllUserData);
        if (success) {
          const from = location.state?.from || `/shopping/${name}/home`;
          moveDefault(from);
          //   navigate(from); // 로그인 성공 후 저장된 url로 이동
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

  // url의 회사명과 localstorage에 저장된 회사명이 다른 경우, url 회사명에 대한 home으로 이동
  useEffect(() => {
    if (clientName !== name) {
      moveDefault(`/shopping/${clientName}/home`);
      //   navigate(`/shopping/${clientName}/home`);
    }
  }, [clientName, name]);

  const moveIdInquiry = (e) => {
    e.preventDefault();
    moveDefault(`/shopping/${clientName}/idInquiry/sms-auth`);
  };

  const movePwInquiry = (e) => {
    e.preventDefault();
    moveDefault(`/shopping/${clientName}/pwInquiry/sms-auth`);
  };

  const moveSignup = (e) => {
    e.preventDefault();
    moveDefault(`/shopping/${clientName}/signup`);
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
    moveIdInquiry,
    movePwInquiry,
    moveSignup,
  };
};
