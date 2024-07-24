import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; // API 호출을 위해 axios 사용

const SimplePasswordComponent = () => {
  const [password, setPassword] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [shuffledNumbers, setShuffledNumbers] = useState([]);
  const navigate = useNavigate();
  const { customerId } = useParams(); // URL에서 customerId 가져오기

  useEffect(() => {
    shuffleNumbers();
  }, []);

  useEffect(() => {
    console.log('Customer ID:', customerId);
    if (password.length === 6) {
      verifyPassword();
    }
  }, [password, customerId]);

  const shuffleNumbers = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    // "지움" 버튼을 숫자 배열의 10번째 위치에 삽입
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
    navigate('/shopping/page/my/auth/edit');
  };

  const verifyPassword = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/easy-pwd/customer/${customerId}/verify`,
        {
          password: password,
        },
      );
      if (response.data === 'success') {
        alert('인증되었습니다.');
        navigate('/shopping/page/subscription/order-completed');
      }
    } catch (error) {
      shuffleNumbers(); // 비밀번호가 틀렸을 때 숫자를 섞음
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

  return (
    <div className='container mx-auto max-w-lg p-4 bg-white h-screen flex flex-col justify-between'>
      <div className='space-y-8'>
        <h1 className='text-2xl font-bold text-center mt-8 mb-6'>간편 비밀번호 입력</h1>

        <div className='flex justify-center space-x-4 mb-10'>
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
