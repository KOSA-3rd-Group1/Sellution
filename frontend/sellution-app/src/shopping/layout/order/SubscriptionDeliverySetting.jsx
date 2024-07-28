import { useEffect, useState } from "react";

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
}) => {
  const [startDate, setStartDate] = useState('');
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const getNextMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((8 - dayOfWeek) % 7));
    return nextMonday.toISOString().split('T')[0];
  }
  //사용자가 날짜 선택할 때마다 호출
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const dayOfWeek = selectedDate.getDay();

    // 선택된 날짜가 월요일이 아닌 경우 알림 표시
    if (dayOfWeek !== 1) {
      alert('배송 시작일은 월요일만 선택 가능합니다.');
      return;
    }

    setStartDate(e.target.value);
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

      <div className='mb-4'>
        <h3 className='text-brandOrange mb-2'>* 배송 주기</h3>
        <select className='w-full p-2 border rounded'>
          <option value=''>배송 주기 선택</option>
          {!isLoading &&
            weekValues.map((value) => (
              <option key={value} value={value}>
                {value}주마다 배송
              </option>
            ))}
        </select>
      </div>

      {subscriptionType === 'COUNT' ? (
        <div className='mb-4'>
          <h3 className='text-brandOrange mb-2'>* 배송 횟수</h3>
          <select className='w-full p-2 border rounded'>
            <option value=''>배송 횟수 선택</option>
            {!isLoading &&
              Array.from(
                { length: maxDeliveryCount - minDeliveryCount + 1 },
                (_, i) => minDeliveryCount + i,
              ).map((count) => (
                <option key={count} value={count}>
                  {count}회
                </option>
              ))}
          </select>
        </div>
      ) : (
        <div className='mb-4'>
          <h3 className='text-brandOrange mb-2'>* 정기배송 기간</h3>
          <select className='w-full p-2 border rounded'>
            <option value=''>정기배송 기간 선택</option>
            {!isLoading &&
              monthValues.map((value) => (
                <option key={value} value={value}>
                  {value}개월
                </option>
              ))}
          </select>
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
