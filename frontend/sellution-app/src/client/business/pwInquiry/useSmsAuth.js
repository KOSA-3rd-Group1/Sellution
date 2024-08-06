import { useEffect, useState } from 'react';
import { validateInputNumber } from '@/client/utility/functions/validateFunction';
import {
  postSendFindPasswordSmsAuthNumber,
  postVerifyFindPasswordSmsAuthNumber,
} from '@/client/utility/apis/pwInquiry/SmsAuthApi';

export const useSmsAuth = ({ moveDefaultSearch, openAlertModal }) => {
  const [data, setData] = useState({ username: '', name: '', phoneNumber: '', authNumber: '' });
  const [nextData, setNextData] = useState({});

  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(180); // 3분으로 해놨어요~
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
    if (data.username.trim() !== '' && data.name.trim() !== '' && data.phoneNumber) {
      const updateData = {
        username: data.username,
        name: data.name,
        phoneNumber: data.phoneNumber,
      };
      try {
        await postSendFindPasswordSmsAuthNumber(updateData);
        setStep(2);
        setTimeLeft(180);
        setIsTimerRunning(true);
      } catch (error) {
        openAlertModal(
          'error',
          '오류',
          `${error?.response?.data?.message}` || '잘못된 요청입니다. 다시 시도해주세요.',
        );
        // alert(`${error.response.data.message}`);
        setStep(1);
      }
    }
  };

  const handleVerify = async () => {
    const updateData = {
      ...data,
    };
    try {
      const response = await postVerifyFindPasswordSmsAuthNumber(updateData);
      setNextData(response.data);
      console.log(response);
      setIsVerified(true);
      setIsTimerRunning(false);
      openAlertModal('success', '성공', '인증이 성공적으로 완료되었습니다.');
    } catch (error) {
      openAlertModal(
        'error',
        '오류',
        `${error?.response?.data?.message}` || '잘못된 인증번호입니다. 다시 시도해주세요.',
      );
      //   alert('잘못된 인증번호입니다. 다시 시도해주세요.');
    }
  };

  const moveNext = (e) => {
    e.preventDefault();
    if (isVerified) {
      moveDefaultSearch('/pwInquiry/reset', nextData);
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
