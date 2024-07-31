import { useState } from 'react';
import { DownChevronIcon } from '../../utility/assets/Icons';

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
  selectedStartDate,
  setSelectedStartDate,
}) => {
  //const [startDate, setStartDate] = useState('');
  const [isWeekOpen, setIsWeekOpen] = useState(false);
  const [isCountOpen, setIsCountOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const getNextMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    return nextMonday.toISOString().split('T')[0];
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const dayOfWeek = selectedDate.getDay();

    if (dayOfWeek !== 1) {
      alert('배송 시작일은 월요일만 선택 가능합니다.');
      return;
    }

    // setStartDate(e.target.value);
    setSelectedStartDate(e.target.value); // 추가
  };

  const handleDropdownClick = (setter) => {
    setter((prev) => !prev);
  };

  const handleWeekOptionClick = (value, id) => {
    setSelectedWeek({ value, id });
    setIsWeekOpen(false);
  };

  const handleCountOptionClick = (count) => {
    setSelectedCount(count);
    setIsCountOpen(false);
  };

  const handleMonthOptionClick = (value, id) => {
    setSelectedMonth({ value, id });
    setIsMonthOpen(false);
  };
  const isDaySelectable = (day) => dayValues.some((dayValue) => dayValue.value === day);
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  return (
    <div className='mb-6 bg-white py-4 w-[90%] space-y-5'>
      <span className='block py-2 mb-2 font-bold'>정기 배송 설정</span>
      <div>
        <h3 className='text-primary mb-2'>* 배송 요일</h3>
        <div className='flex justify-between'>
          {weekDays.map((day) => (
            <button
              key={day}
              onClick={() => isDaySelectable(day) && toggleDay(day)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedDays && selectedDays.includes(day)
                  ? 'bg-primary text-white'
                  : isDaySelectable(day)
                    ? 'border border-gray-300 text-gray-500'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isDaySelectable(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className='mb-4 relative'>
        <h3 className='text-primary mb-2'>* 배송 주기</h3>
        <div
          className='w-full p-2 border border-gray-300 rounded cursor-pointer bg-white flex items-center justify-between'
          onClick={() => handleDropdownClick(setIsWeekOpen)}
        >
          {selectedWeek ? `${selectedWeek.value}주마다 배송` : '배송 주기 선택'}
          <div className='flex items-center px-2 pointer-events-none'>
            <DownChevronIcon className={'w-4 h-4 text-gray-400'} />
          </div>
        </div>
        {isWeekOpen && (
          <div className='absolute z-10 w-full bg-white border border-gray-300 rounded mt-1'>
            <ul className='max-h-40 overflow-auto'>
              {weekValues.map(({ id, value }) => (
                <li
                  key={id}
                  className='p-2 cursor-pointer hover:bg-gray-200'
                  onClick={() => handleWeekOptionClick(value, id)}
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
          <h3 className='text-primary mb-2'>* 배송 횟수</h3>
          <div
            className='w-full p-2 border border-gray-300 rounded cursor-pointer bg-white flex items-center justify-between'
            onClick={() => handleDropdownClick(setIsCountOpen)}
          >
            {selectedCount ? `${selectedCount}회` : '배송 횟수 선택'}
            <div className='flex items-center px-2 pointer-events-none'>
              <DownChevronIcon className={'w-4 h-4 text-gray-400'} />
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
          <h3 className='text-primary mb-2'>* 정기배송 기간</h3>
          <div
            className='w-full p-2 border border-gray-300 rounded cursor-pointer bg-white flex items-center justify-between'
            onClick={() => handleDropdownClick(setIsMonthOpen)}
          >
            {selectedMonth ? `${selectedMonth.value}개월` : '정기배송 기간 선택'}
            <div className='flex items-center px-2 pointer-events-none'>
              <DownChevronIcon className={'w-4 h-4 text-gray-400'} />
            </div>
          </div>
          {isMonthOpen && (
            <div className='absolute z-10 w-full bg-white border border-gray-300 rounded mt-1'>
              <ul className='max-h-40 overflow-auto'>
                {monthValues.map(({ id, value }) => (
                  <li
                    key={id}
                    className='p-2 cursor-pointer hover:bg-gray-200'
                    onClick={() => handleMonthOptionClick(value, id)}
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
        <h3 className='text-primary mb-2'>* 배송 시작일</h3>
        <input
          type='date'
          className='w-full p-2 border rounded'
          value={selectedStartDate}
          min={getNextMonday()}
          step={7}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
};

export default SubscriptionDeliverySetting;
