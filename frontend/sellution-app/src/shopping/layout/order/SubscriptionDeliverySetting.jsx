const SubscriptionDeliverySetting = ({ selectedDays, toggleDay }) => {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  return (
    <div className='mb-6 bg-white py-4 w-[90%] space-y-5'>
      <span className='block py-2 mb-2 font-bold'>정기 배송 설정</span>
      <div>
        <h3 className='text-brandOrange mb-2'>* 배송 요일</h3>
        <div className='flex justify-between'>
          {days.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedDays.includes(day)
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-300 text-gray-500'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className='mb-4'>
        <h3 className='text-brandOrange mb-2'>* 배송 주기</h3>
        <select className='w-full p-2 border rounded'>
          <option>1주마다 배송</option>
          {/* 백엔드에서 받은 데이터로 옵션을 채우세요 */}
        </select>
      </div>

      <div className='mb-4'>
        <h3 className='text-brandOrange mb-2'>* 배송 횟수</h3>
        <select className='w-full p-2 border rounded'>
          <option>8회</option>
          {/* 백엔드에서 받은 데이터로 옵션을 채우세요 */}
        </select>
      </div>

      <div>
        <h3 className='text-brandOrange mb-2'>* 배송 시작일</h3>
        <input type='date' className='w-full p-2 border rounded' defaultValue='2024-06-24' />
      </div>
    </div>
  );
};
export default SubscriptionDeliverySetting;
