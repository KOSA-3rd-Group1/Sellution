import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import { useEffect, useState } from 'react';
import {
  postDuplicatedUsernameCheck,
  postSendSignupSmsAuthNumber,
  postSignupCustomer,
  postVerifySignupSmsAuthNumber,
} from '@/shopping/utility/apis/signUp/signUpApi';
import { validateInputNumber } from '@/client/utility/functions/validateFunction';
import { useParams } from 'react-router-dom';

export const useSignUp = ({ moveDefault }) => {
  const companyId = useCompanyInfoStore((state) => state.companyId);
  const { clientName } = useParams();

  const [data, setData] = useState({
    username: '', // 회원 아이디
    name: '', // 회원명
    password: '', // 비밀번호
    confirmPassword: '', // 비밀번호 재확인
    phoneNumber: '', // 휴대폰 번호
    authNumber: '', // 인증 번호
    smsConsent: false,
  });

  const [usernameConfirm, setUsernameConfirm] = useState(null); // 중복아이디 여부
  const [usernameConfirmErrorMessage, setUsernameConfirmErrorMessage] =
    useState('이미 사용중인 아이디입니다.');
  const [passwordMatch, setPasswordMatch] = useState(null); // 비밀번호 일치 여부

  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // 휴대폰 인증 여부

  // 비밀번호 재확인과 비교
  useEffect(() => {
    if (data?.password.trim() !== '' && data?.confirmPassword.trim() !== '') {
      setPasswordMatch(data?.password === data?.confirmPassword);
    } else {
      setPasswordMatch(false);
    }
  }, [data.password, data.confirmPassword]);

  // companyId가 없으면 홈으로 돌려보내기
  useEffect(() => {
    if (companyId !== null || companyId === '') {
      //페이지 이동시키기
    }
  }, [companyId]);

  // 인증 번호 발급 후 입력 제한 시간
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearTimeout(timer);
  }, [isTimerRunning, timeLeft]);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    if (key === 'username') {
      setUsernameConfirm(null);
    }
    if (key === 'phoneNumber' && !validateInputNumber(value)) {
      return;
    }
    // phoneNumber 값 건드리면 인증 번호 유효성 체크 초기화.
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // 회원 아이디 중복 여부 확인
  const handleCheckIdDuplicate = async () => {
    // throw로 에러 던지기
    if (data.username.trim() === '' || !/^[a-zA-Z][a-zA-Z0-9]{5,19}$/.test(data.username)) {
      setUsernameConfirmErrorMessage('유효하지 않은 아이디입니다.');
      setUsernameConfirm(false);
      return;
    }
    try {
      await postDuplicatedUsernameCheck({ companyId, username: data.username });
      console.log(true);
      setUsernameConfirm(true);
    } catch (error) {
      setUsernameConfirm(false);
      setUsernameConfirmErrorMessage('이미 사용중인 아이디입니다.');
    }
  };

  // 인증 번호 전송 요청
  const handleRequestAuth = async () => {
    // try문을 전체로 씌우기
    if (data.phoneNumber) {
      const updateData = { companyId, phoneNumber: data.phoneNumber };
      try {
        const response = await postSendSignupSmsAuthNumber(updateData);
        console.log(response);
        setStep(2);
        setTimeLeft(180);
        setIsTimerRunning(true);
      } catch (error) {
        alert(`${error.response.data.message}`);
        setStep(1);
      }
    }
  };

  // 인증 번호 유효성 검사
  const handleVerify = async () => {
    // 값들이 다 입력되어 있는지 유효성 체크해야 함.
    const updateData = {
      companyId,
      name: data.name,
      phoneNumber: data.phoneNumber,
      authNumber: data.authNumber,
    };
    try {
      await postVerifySignupSmsAuthNumber(updateData);
      setIsVerified(true);
      setIsTimerRunning(false);
    } catch (error) {
      console.log(error);
      alert('잘못된 인증번호입니다. 다시 시도해주세요.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // if (!usernameConfirm) {
      //   throw new ValidationError('아이디 중복 확인이 필요합니다.');
      // }
      // if (!passwordMatch) {
      //   throw new ValidationError('비밀번호가 일치하지 않습니다.');
      // }
      // if (data.password.length < 8) {
      //   throw new ValidationError('비밀번호는 8자 이상이어야 합니다.');
      // }

      const updateData = {
        companyId,
        username: data.username,
        password: data.password,
        name: data.name,
        phoneNumber: data.phoneNumber,
      };
      await postSignupCustomer(updateData);
      alert('회원가입 성공');
      await moveDefault(`/shopping/${clientName}/login`);
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
      //   if (error instanceof ValidationError) {
      //     alert(error.message);
      //   } else {
      //     alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
      //   }
    }
  };

  return {
    data,
    usernameConfirm, // 중복 아이디 확인
    usernameConfirmErrorMessage,
    passwordMatch, // 비밀번호 일치 여부
    step, // 휴대폰 인증 요청 단계
    isVerified, // 휴대폰 인증 여부
    timeLeft, // 인증 남은 시간
    isTimerRunning,
    handleChangeInputValue, // 변경 가능한 값 변경 핸들러
    handleCheckIdDuplicate, // 아이디 중봉 확인 요청
    handleRequestAuth, // 인증 번호 요청
    handleVerify, // 인증번호 비교 검사 요청
    handleSubmit, // 회원 가입 요청
  };
};
