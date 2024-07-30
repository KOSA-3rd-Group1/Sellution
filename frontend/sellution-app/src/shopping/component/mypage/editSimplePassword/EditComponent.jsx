import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { SetPasswordIcon } from '@/shopping/utility/assets/Icons.jsx';
import MenuHeaderNav from "@/shopping/layout/MenuHeaderNav.jsx";

const EditComponent = () => {
  const [firstPassword, setFirstPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shuffledNumbers, setShuffledNumbers] = useState([]);
  const navigate = useNavigate();
  const { clientName, customerId } = useParams();
  const location = useLocation();

  useEffect(() => {
    shuffleNumbers();
  }, [step]);

  useEffect(() => {
    if (firstPassword.length === 6 && step === 1) {
      setStep(2);
      setErrorMessage('');
    } else if (secondPassword.length === 6 && step === 2) {
      verifyPasswords();
    }
  }, [firstPassword, secondPassword, step]);

  const shuffleNumbers = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    numbers.splice(9, 0, '지움');
    setShuffledNumbers(numbers);
  };

  const handleNumberClick = (number) => {
    if (step === 1 && firstPassword.length < 6) {
      setFirstPassword((prev) => prev + number);
    } else if (step === 2 && secondPassword.length < 6) {
      setSecondPassword((prev) => prev + number);
    }
  };

  const handleClear = () => {
    if (step === 1) {
      setFirstPassword('');
    } else {
      setSecondPassword('');
    }
  };

  const handleDelete = () => {
    if (step === 1) {
      setFirstPassword((prev) => prev.slice(0, -1));
    } else {
      setSecondPassword((prev) => prev.slice(0, -1));
    }
  };

  const verifyPasswords = () => {
    if (firstPassword === secondPassword) {
      registerPassword();
    } else {
      setErrorMessage(<div>비밀번호가 일치하지 않습니다.<br/> 다시 입력해주세요.</div>);
      setStep(2); // 한 번만 다시 입력받기 위해 step을 2로 유지
      setSecondPassword('');
    }
  };

  const registerPassword = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/easy-pwd/customer/${customerId}`,
        { password: firstPassword },
      );
      if (response.data === 'success') {
        setIsComplete(true);
      }
    } catch (error) {
      setErrorMessage('비밀번호 등록에 실패했습니다. 다시 시도해주세요.');
      setStep(1);
      setFirstPassword('');
      setSecondPassword('');
    }
  };

  if (isComplete) {
    return (
      <div className='container mx-auto h-full max-w-lg p-4 bg-white flex flex-col justify-between'>
        <div className='space-y-8 flex-grow flex flex-col items-center justify-center'>
          <h2 className='text-2xl font-bold mb-4'>간편 비밀번호 등록 완료</h2>
          <SetPasswordIcon className='mb-4' />
        </div>
        <div className='mb-8 flex justify-center'>
          <button
            className='bg-brandOrange text-white px-4 py-2 rounded-full w-full max-w-sm'
            onClick={() => {
              if (location.state?.returnTo) {
                navigate(location.state.returnTo, {
                  state: { orderData: location.state?.orderData }
                });
              } else {
                navigate(`/shopping/${clientName}/my/${customerId}`);
              }
            }}
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto h-full max-w-lg p-4 bg-white flex flex-col justify-between'>
      <MenuHeaderNav title='간편비밀번호'/>
      <div className='space-y-8'>
        <h1 className='text-2xl font-bold text-center mt-8 mb-6'>
          {step === 1 ? '간편 비밀번호 등록' : '간편 비밀번호 확인'}
        </h1>
        <div className='flex justify-center space-x-4 mb-2'>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full ${
                index < (step === 1 ? firstPassword.length : secondPassword.length)
                  ? 'bg-brandOrange'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        {step === 1 && !errorMessage && (
          <p className='text-center mb-10'>
            간편 비밀번호를 등록하시면,<br/> 6자리 숫자 입력으로 결제가 가능합니다.
          </p>
        )}
        {step === 2 && !errorMessage && (
          <p className='text-center mb-10'>다시 한번 입력해주세요.</p>
        )}
        {errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>}
      </div>

      <div className='flex-grow flex items-center '>
        <div className='bg-brandOrange rounded-lg p-4 w-full flex-grow flex flex-col justify-center'>
          <div className='grid grid-cols-3 gap-4 flex-grow'>
            {shuffledNumbers.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item === '지움') handleClear();
                  else handleNumberClick(item);
                }}
                className='text-white text-2xl font-bold py-4 rounded-lg h-20'
              >
                {item}
              </button>
            ))}
            <button
              onClick={handleDelete}
              className='text-white text-2xl font-bold py-4 rounded-lg h-20'
            >
              ⌫
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditComponent;