import { useState } from 'react';
import CheckboxGroup from '@/client/layout/common/CheckboxGroup';
import CheckdayGroup from '@/client/layout/common/CheckdayGroup';

const SubscriptionTypeCount = () => {
  const [data, setData] = useState({
    subscriptionTypeMonth: { 1: false, 2: false, 3: false, 4: false, 5: false },
    subscriptionTypeDayOption: { MON: false, TUE: false, WED: false, THU: false, FRI: false },
  });

  const handleChangeValue = (key, value) => {
    if ((key === 'minCount' || key === 'maxCount') && !/^\d*$/.test(value)) {
      return;
    }
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangeCheckboxValue = (key, selectData) => {
    const updateData = data[key];
    updateData[selectData] = !updateData[selectData];
    setData((prev) => ({ ...prev, [key]: updateData }));
  };

  console.log(data);

  return (
    <div>
      <div className='text-xs'>
        <div className='text-gray-700 font-semibold'>이용 횟수</div>
        <div className='flex flex-col gap-2 my-4 mx-2'>
          <div className='relative flex gap-6'>
            <div>최소</div>
            <div className='relative'>
              <input
                id='minValue'
                className={`w-24 h-6 border bg-gray-100 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-brandOrange ring-offset-2 rounded-md text-right pl-2 pr-6`}
                value={data?.minCount || ''}
                onChange={(e) => handleChangeValue('minCount', e.target.value)}
                placeholder='5'
              />
              <label
                htmlFor='minValue'
                className={`absolute top-1/2 translate-y-[-50%] right-2 ${data?.minCount ? 'text-slate-900' : 'text-gray-400'}`}
              >
                회
              </label>
            </div>
          </div>
          <div className='relative flex gap-6 items-center'>
            <div>최대</div>
            <div className='relative'>
              <input
                id='maxValue'
                className={` w-24 h-6 border bg-gray-100 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-brandOrange ring-offset-2 rounded-md text-right pl-2 pr-6 `}
                value={data?.maxCount || ''}
                onChange={(e) => handleChangeValue('maxCount', e.target.value)}
                type='text'
                placeholder='30'
              />
              <label
                htmlFor='maxValue'
                className={`absolute top-1/2 translate-y-[-50%] right-2 ${data?.maxCount ? 'text-slate-900' : 'text-gray-400'}`}
              >
                회
              </label>
            </div>
          </div>
        </div>
        <div className='text-gray-500'>
          * 배송 횟수 범위를 설정합니다. 회원은 설정된 범위 내의 배송 횟수만 선택 가능합니다.
        </div>
        <div className='text-gray-500'>* 최댓값 미지정 시 30회로 설정됩니다.</div>
      </div>

      <div className='divider'></div>

      <div className='text-xs'>
        <div className='text-gray-700 font-semibold'>배송 주기</div>
        <div className='my-4 mx-2'>
          <CheckboxGroup
            className={'w-full flex items-center gap-4'}
            data={data}
            options={[
              { label: '1주마다', selectData: '1' },
              { label: '2주마다', selectData: '2' },
              { label: '3주마다', selectData: '3' },
              { label: '4주마다', selectData: '4' },
              { label: '5주마다', selectData: '5' },
            ]}
            name='subscriptionTypeMonth'
            onChange={handleChangeCheckboxValue}
          />
        </div>
        <div className='text-gray-500'>* 특정 주마다 배송되도록 설정할 수 있습니다.</div>
      </div>

      <div className='divider'></div>

      <div className='text-xs'>
        <div className='text-gray-700 font-semibold'>배송 가능 요일</div>
        <div className='my-4 mx-2'>
          <CheckdayGroup
            className={'w-full flex items-center gap-4'}
            data={data}
            options={[
              { label: '월요일', selectData: 'MON' },
              { label: '화요일', selectData: 'TUE' },
              { label: '수요일', selectData: 'WED' },
              { label: '목요일', selectData: 'THU' },
              { label: '금요일', selectData: 'FRI' },
            ]}
            name='subscriptionTypeDayOption'
            onChange={handleChangeCheckboxValue}
          />
        </div>
        <div className='text-gray-500'>
          * 사용자가 선택한 요일에만 회원은 배송일을 선택할 수 있습니다.
        </div>
        <div className='text-gray-500'>* 회원은 여러 요일을 선택할 수 있습니다.</div>
        <div className='text-gray-500'>* 해당 주기의 첫 번째 주마다 배송이 진행됩니다.</div>
      </div>
    </div>
  );
};

export default SubscriptionTypeCount;
