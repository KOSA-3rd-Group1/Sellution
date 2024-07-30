import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import MenuHeaderNav from '@/shopping/layout/MenuHeaderNav.jsx';

const SimplePasswordComponent = () => {
  const [password, setPassword] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [shuffledNumbers, setShuffledNumbers] = useState([]);
  const [hasPassword, setHasPassword] = useState(null);
  const navigate = useNavigate();
  const { customerId, clientName } = useParams();
  const location = useLocation();

  useEffect(() => {
    checkPassword();
    shuffleNumbers();
  }, []);

  useEffect(() => {
    if (password.length === 6) {
      verifyPassword();
    }
  }, [password]);

  const checkPassword = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/easy-pwd/customer/${customerId}/check`,
      );
      console.log('Password check response:', response.data);
      setHasPassword(response.data === true);
      if (response.data === false) {
        // 간편 비밀번호가 없는 경우 SMS 인증 페이지로 이동
        navigate(`/shopping/${clientName}/my/${customerId}/auth/sms`, {
          state: {
            returnTo: `/shopping/${clientName}/ordersheet/auth/${customerId}`,
            orderData: location.state?.orderData,
          },
        });
      }
    } catch (error) {
      console.error('Error checking password:', error);
    }
  };

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
    if (password.length < 6) {
      setPassword((prev) => prev + number);
    }
  };

  const handleClear = () => {
    setPassword('');
  };

  const handleDelete = () => {
    setPassword((prev) => prev.slice(0, -1));
  };

  const handleReregister = () => {
    navigate(`/shopping/${clientName}/my/${customerId}/auth/sms`, {
      state: {
        returnTo: `/shopping/${clientName}/ordersheet/auth/${customerId}`,
        orderData: location.state?.orderData,
      },
    });
  };

  const verifyPassword = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/easy-pwd/customer/${customerId}/verify`,
        { password: password },
      );
      if (response.data === 'success') {
        console.log('간편비밀번호 검증 성공');
        console.log('넘겨온값 확인',location.state)
        if (location.state && location.state.orderData) {
          completeOrder(location.state.orderData);
        } else {
          console.log(' response == > ', response);
          alert('인증되었습니다.');
          navigate(`/shopping/${clientName}/onetime/order/${customerId}`);
        }
      }
    } catch (error) {
      shuffleNumbers();
      setErrorCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount >= 3) {
          alert('비밀번호를 3회 이상 틀렸습니다. 비밀번호 재등록 페이지로 이동합니다.');
          handleReregister();
        } else {
          setErrorMessage(
            `비밀번호가 ${newCount}회 틀렸습니다. 3회 틀릴시 비밀번호를 재등록 해야 됩니다.`,
          );
        }
        return newCount;
      });
      setPassword('');
    }
  };

  const completeOrder = async (orderData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/orders/customers/${customerId}`,
        orderData,
      );
      if (response.data.startsWith('success')) {
        const savedOrderId = response.data.split('success, 생성된 주문 아이디 : ')[1];
        if (orderData.orderType === 'ONETIME') {
          navigate(`/shopping/${clientName}/onetime/order-completed/${savedOrderId}`);
        } else if (
          orderData.orderType === 'COUNT_SUBSCRIPTION' ||
          orderData.orderType === 'MONTH_SUBSCRIPTION'
        ) {
          navigate(`/shopping/${clientName}/subscription/order-completed/${savedOrderId}`);
        } else {
          throw new Error('주문 생성 실패');
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('주문 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      navigate(`/shopping/${clientName}/onetime/order/${customerId}`);
    }
  };

  if (hasPassword === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto h-full max-w-lg p-4 bg-white flex flex-col justify-between'>
      <MenuHeaderNav title='간편비밀번호' />
      <div className='space-y-8'>
        <h1 className='text-2xl font-bold text-center mt-8 mb-6'>간편 비밀번호 입력</h1>

        <div className='flex justify-center space-x-4 mb-2'>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full ${
                index < password.length ? 'bg-brandOrange' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>}

        <button onClick={handleReregister} className='w-full text-gray-700 py-2 text-center mb-16'>
          비밀번호 재등록 &gt;
        </button>
      </div>

      <div className='mb-12 flex-grow flex items-end'>
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

export default SimplePasswordComponent;
