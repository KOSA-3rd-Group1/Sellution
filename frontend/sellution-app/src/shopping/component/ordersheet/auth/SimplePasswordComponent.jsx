import React, { useState } from 'react'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';

const SimplePasswordComponent = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
    navigate('/shopping/page/mypage/editSimplePassword/EditComponent');
  };

  return (
    <div className='container mx-auto max-w-lg p-4 bg-white h-screen flex flex-col justify-between'>
      <div className='space-y-8'>
        <h1 className='text-2xl font-bold text-center mt-8'>간편 비밀번호 입력</h1>

        <div className='flex justify-center space-x-4'>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full ${
                index < password.length ? 'bg-brandOrange' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button onClick={handleReregister} className='w-full text-gray-700 py-2 text-center'>
          비밀번호 재등록 &gt;
        </button>
      </div>

      <div className='mb-8'>
        <div className='bg-brandOrange rounded-lg p-4'>
          <div className='grid grid-cols-3 gap-4'>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '지움', 0, '⌫'].map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (typeof item === 'number') handleNumberClick(item);
                  else if (item === '지움') handleClear();
                  else if (item === '⌫') handleDelete();
                }}
                className='text-white text-2xl font-bold py-4 rounded-lg'
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePasswordComponent;
