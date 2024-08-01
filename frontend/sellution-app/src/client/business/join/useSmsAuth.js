import { useEffect, useState } from 'react';
import useSignupInfoStore from '@/client/store/stores/useSignupInfoStore';
import {
  postSendSignupSmsAuthNumber,
  postVerifySignupSmsAuthNumber,
} from '@/client/utility/apis/join/SmsAuthApi';
import { validateInputNumber } from '@/client/utility/functions/validateFunction';
import { formatPhoneNumber } from '@/client/utility/functions/formatterFunction';

export const useSmsAuth = ({ moveDefault }) => {
  const { companyId, setSignupInfo } = useSignupInfoStore((state) => ({
    companyId: state.companyId,
    setSignupInfo: state.setSignupInfo,
    resetSignupInfo: state.resetSignupInfo,
  }));
  console.log(companyId);

  const [data, setData] = useState({ name: '', phoneNumber: '', authNumber: '' });

  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(180); // 3분으로 해놨어요~
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (companyId === null) {
      moveDefault('/join/contract-auth');
    }
  }, []);

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
    if (key === 'phoneNumber' && !validateInputNumber(value)) {
      return;
    }
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // 인증 번호 전송 요청
  const handleRequestAuth = async () => {
    if (data.name.trim() !== '' && data.phoneNumber) {
      const updateData = { companyId, phoneNumber: data.phoneNumber };
      try {
        await postSendSignupSmsAuthNumber(updateData);
        setStep(2);
        setTimeLeft(180);
        setIsTimerRunning(true);
      } catch (error) {
        alert(`${error.response.data.message}`);
        setStep(1);
      }
    }
  };

  const handleVerify = async () => {
    const updateData = {
      companyId,
      ...data,
    };
    try {
      await postVerifySignupSmsAuthNumber(updateData);
      setSignupInfo({ name: data.name, phoneNumber: formatPhoneNumber(data.phoneNumber) });
      setIsVerified(true);
      setIsTimerRunning(false);
    } catch (error) {
      console.log(error);
      alert('잘못된 인증번호입니다. 다시 시도해주세요.');
    }
  };

  const moveNext = (e) => {
    e.preventDefault();
    if (isVerified) {
      moveDefault('/join/begin');
    }
  };

  return {
    data,
    step,
    timeLeft,
    isTimerRunning,
    isVerified,
    handleChangeInputValue,
    handleRequestAuth,
    handleVerify,
    moveNext,
  };
};
