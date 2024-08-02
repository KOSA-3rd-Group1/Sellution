import { useEffect, useState } from 'react';
import { validateInputNumber } from '@/client/utility/functions/validateFunction';
import {
  postSendFindIdSmsAuthNumber,
  postVerifyFindIdSmsAuthNumber,
} from '@/client/utility/apis/idInquiry/SmsAuthApi';

export const useSmsAuth = ({ moveDefaultSendState }) => {
  const [data, setData] = useState({ name: '', phoneNumber: '', authNumber: '' });
  const [nextData, setNextData] = useState({});

  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

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
      const updateData = { name: data.name, phoneNumber: data.phoneNumber };
      try {
        await postSendFindIdSmsAuthNumber(updateData);
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
      ...data,
    };
    try {
      const response = await postVerifyFindIdSmsAuthNumber(updateData);
      setNextData(response.data);
      console.log(response);
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
      moveDefaultSendState('/idInquiry/view', nextData);
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
