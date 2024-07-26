import { useState } from 'react';

const SubscriptionDeliverySetting = ({
  selectedDays,
  toggleDay,
  subscriptionType,
  dayValues = [],
  weekValues = [],
  monthValues = [],
  minDeliveryCount = 0,
  maxDeliveryCount = 0,
  isLoading,
  setSelectedWeek,
  selectedWeek,
  setSelectedCount,
  selectedCount,
  setSelectedMonth,
  selectedMonth,
}) => {
  const [startDate, setStartDate] = useState('');
  const [isWeekOpen, setIsWeekOpen] = useState(false);
  const [isCountOpen, setIsCountOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const getNextMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((8 - dayOfWeek) % 7));
    return nextMonday.toISOString().split('T')[0];
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const dayOfWeek = selectedDate.getDay();

    if (dayOfWeek !== 1) {
      alert('배송 시작일은 월요일만 선택 가능합니다.');
      return;
    }

    setStartDate(e.target.value);
  };

  const handleDropdownClick = (setter) => {
    setter((prev) => !prev);
  };

  const handleWeekOptionClick = (value) => {
    setSelectedWeek(value);
    setIsWeekOpen(false);
  };

  const handleCountOptionClick = (value) => {
    setSelectedCount(value);
    setIsCountOpen(false);
  };

  const handleMonthOptionClick = (value) => {
    setSelectedMonth(value);
    setIsMonthOpen(false);
  };

  return (
    <div className='mb-6 bg-white py-4 w-[90%] space-y-5'>
      <span className='block py-2 mb-2 font-bold'>정기 배송 설정</span>
      <div>
        <h3 className='text-brandOrange mb-2'>* 배송 요일</h3>
        <div className='flex justify-between'>
          {weekDays.map((day) => (
            <button
              key={day}
              onClick={() => dayValues.includes(day) && toggleDay(day)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedDays.includes(day)
                  ? 'bg-orange-500 text-white'
                  : dayValues.includes(day)
                    ? 'border border-gray-300 text-gray-500'
                    : 'border border-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
              }`}
              disabled={!dayValues.includes(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className='mb-4 relative'>
        <h3 className='text-brandOrange mb-2'>* 배송 주기</h3>
        <div
          className='w-full p-2 border border-gray-300 rounded cursor-pointer bg-white flex items-center justify-between'
          onClick={() => handleDropdownClick(setIsWeekOpen)}
        >
          {selectedWeek ? `${selectedWeek}주마다 배송` : '배송 주기 선택'}
          <div className='flex items-center px-2 pointer-events-none'>
            <svg
              className='w-4 h-4 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              ></path>
            </svg>
          </div>
        </div>
        {isWeekOpen && (
          <div className='absolute z-10 w-full bg-white border border-gray-300 rounded mt-1'>
            <ul className='max-h-40 overflow-auto'>
              {weekValues.map((value) => (
                <li
                  key={value}
                  className='p-2 cursor-pointer hover:bg-gray-200'
                  onClick={() => handleWeekOptionClick(value)}
                >
                  {value}주마다 배송
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {subscriptionType === 'COUNT' ? (
        <div className='mb-4 relative'>
          <h3 className='text-brandOrange mb-2'>* 배송 횟수</h3>
          <div
            className='w-full p-2 border border-gray-300 rounded cursor-pointer bg-white flex items-center justify-between'
            onClick={() => handleDropdownClick(setIsCountOpen)}
          >
            {selectedCount ? `${selectedCount}회` : '배송 횟수 선택'}
            <div className='flex items-center px-2 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 9l-7 7-7-7'
                ></path>
              </svg>
            </div>
          </div>
          {isCountOpen && (
            <div className='absolute z-10 w-full bg-white border border-gray-300 rounded mt-1'>
              <ul className='max-h-40 overflow-auto'>
                {Array.from(
                  { length: maxDeliveryCount - minDeliveryCount + 1 },
                  (_, i) => minDeliveryCount + i,
                ).map((count) => (
                  <li
                    key={count}
                    className='p-2 cursor-pointer hover:bg-gray-200'
                    onClick={() => handleCountOptionClick(count)}
                  >
                    {count}회
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className='mb-4 relative'>
          <h3 className='text-brandOrange mb-2'>* 정기배송 기간</h3>
          <div
            className='w-full p-2 border border-gray-300 rounded cursor-pointer bg-white flex items-center justify-between'
            onClick={() => handleDropdownClick(setIsMonthOpen)}
          >
            {selectedMonth ? `${selectedMonth}개월` : '정기배송 기간 선택'}
            <div className='flex items-center px-2 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 9l-7 7-7-7'
                ></path>
              </svg>
            </div>
          </div>
          {isMonthOpen && (
            <div className='absolute z-10 w-full bg-white border border-gray-300 rounded mt-1'>
              <ul className='max-h-40 overflow-auto'>
                {monthValues.map((value) => (
                  <li
                    key={value}
                    className='p-2 cursor-pointer hover:bg-gray-200'
                    onClick={() => handleMonthOptionClick(value)}
                  >
                    {value}개월
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div>
        <h3 className='text-brandOrange mb-2'>* 배송 시작일</h3>
        <input
          type='date'
          className='w-full p-2 border rounded'
          value={startDate}
          min={getNextMonday()}
          step={7}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
};
export default SubscriptionDeliverySetting;
