import { useEffect, useRef, useState } from 'react';
import { DeleteIcon } from '../utility/assets/Icons';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import Confetti from 'react-confetti';

const EventModal = ({ isOpen, onClose, onClick, onCloseForToday }) => {
  const [couponPercentage, setCouponPercentage] = useState('??');
  const [showConfetti, setShowConfetti] = useState(false);
  const clientName = useCompanyInfoStore((state) => state.name);

  const animationIntervalRef = useRef(null);

  useEffect(() => {
    let changeInterval;
    let pauseTimeout;

    if (isOpen) {
      setShowConfetti(true);
      animateCouponPercentage();

      changeInterval = setInterval(() => {
        animateCouponPercentage();
        pauseTimeout = setTimeout(() => {
          clearInterval(animationIntervalRef.current);
          setCouponPercentage(20); // 멈출 때의 할인율 고정
        }, 3000); // 3초 후에 멈춤
      }, 5000); // 5초마다 재개 (3초 애니메이션 + 2초 멈춤)
    } else {
      setShowConfetti(false);
      setCouponPercentage('??');
      clearInterval(changeInterval);
      clearTimeout(pauseTimeout);
      clearInterval(animationIntervalRef.current);
    }

    return () => {
      clearInterval(changeInterval);
      clearTimeout(pauseTimeout);
      clearInterval(animationIntervalRef.current);
      setShowConfetti(false);
      setCouponPercentage('??');
    };
  }, [isOpen]);

  const animateCouponPercentage = () => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setCouponPercentage(Math.floor(Math.random() * 30));
      if (count === 30) {
        // 3초 동안 100ms마다 실행되므로 30번 반복
        clearInterval(interval);
      }
    }, 100);

    // 외부에서 참조할 수 있도록 animationInterval을 업데이트
    animationIntervalRef.current = interval;
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10'>
      <div className='bg-white max-w-sm w-[85%] mx-4 relative'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300 z-20'
        >
          <DeleteIcon className='h-6 w-6' />
        </button>
        <div className='bg-[#F9F9F9] py-16 rounded relative overflow-hidden flex justify-center items-center w-full h-full'>
          <div className='absolute inset-0 bg-opacity-20 bg-white animate-pulse'></div>
          {showConfetti && <Confetti />}
          <div className='text-white bg-black w-[75%] h-[50%] flex flex-col items-center gap-2 py-5'>
            <p className='text-sm'>{clientName}</p>
            <p className='text-sm'>쇼핑 지원 쿠폰</p>
            <p className='text-4xl font-bold'>{couponPercentage}%</p>
          </div>
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-center mb-4 text-lg font-semibold'>쿠폰이 도착했어요!</p>
          <p className='text-center text-sm text-gray-600 mb-4'>
            발급 가능한 쿠폰을 확인하고
            <br />
            한정 쿠폰으로 할인 받으세요.
          </p>
          <button
            onClick={onClick}
            className='w-[80%] bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300'
          >
            쿠폰 발급 받으러 가기!
          </button>
        </div>
        <div className='flex justify-end py-5'>
          <button
            onClick={onCloseForToday}
            className='text-xs text-gray-500 hover:text-gray-700 transition duration-300 px-5'
          >
            오늘 하루 그만보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
