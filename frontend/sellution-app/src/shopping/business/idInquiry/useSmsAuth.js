import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import {
  postSendFindIdSmsAuthNumber,
  postVerifyFindIdSmsAuthNumber,
} from '@/shopping/utility/apis/idInquiry/SmsAuthApi';
import { validateInputNumber } from '@/client/utility/functions/validateFunction';

export const useSmsAuth = ({ moveDefault, moveDefaultSendState }) => {
  const companyId = useCompanyInfoStore((state) => state.companyId);

  const [data, setData] = useState({ name: '', phoneNumber: '', authNumber: '' });
  const [nextData, setNextData] = useState({});

  const { clientName } = useParams();

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
      const updateData = { companyId, name: data.name, phoneNumber: data.phoneNumber };
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
      companyId,
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
      moveDefaultSendState(`/shopping/${clientName}/idInquiry/view`, nextData);
    }
  };

  const moveBack = (e) => {
    e.preventDefault();
    moveDefault(`/shopping/${clientName}/login`);
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
    moveBack,
  };
};
