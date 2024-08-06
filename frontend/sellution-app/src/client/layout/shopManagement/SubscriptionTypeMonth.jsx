import Select from 'react-select';
import CheckboxGroup from '@/client/layout/common/CheckboxGroup';
import CheckdayGroup from '@/client/layout/common/CheckdayGroup';
import useSaleSettingStore from '@/client/store/stores/useSaleSettingStore';

const selectMonthOptions = [
  { value: '1', label: '1개월' },
  { value: '2', label: '2개월' },
  { value: '3', label: '3개월' },
  { value: '4', label: '4개월' },
  { value: '5', label: '5개월' },
  { value: '6', label: '6개월' },
  { value: '7', label: '7개월' },
  { value: '8', label: '8개월' },
  { value: '9', label: '9개월' },
  { value: '10', label: '10개월' },
  { value: '11', label: '11개월' },
  { value: '12', label: '12개월' },
];

const SubscriptionTypeMonth = () => {
  const { data, setData } = useSaleSettingStore((state) => ({
    data: state.subscriptionTypeMonth,
    setData: state.setSubscriptionTypeMonth,
  }));

  // 정기 배송 개월 옵션 변경
  const handleChangeSelectedMonthOptions = (selectedOptions) => {
    const sortedOptions = selectedOptions
      ? [...selectedOptions].sort((a, b) => a.value - b.value)
      : [];
    setData({ selectedMonthOptions: sortedOptions });
  };

  const handleChangeCheckboxValue = (key, selectData) => {
    const updateData = data[key];
    updateData[selectData] = !updateData[selectData];
    setData({ [key]: updateData });
  };

  return (
    <div>
      <div className='text-xs'>
        <div className='text-gray-700 font-semibold'>이용 기간</div>
        <div className='my-4 mx-2'>
          <Select
            isMulti
            closeMenuOnSelect={false}
            className='selectItem'
            classNamePrefix='select'
            onChange={handleChangeSelectedMonthOptions}
            options={selectMonthOptions}
            placeholder='개월 선택'
            value={data.selectedMonthOptions}
            theme={(theme) => ({
              ...theme,
              borderRadius: 5,
              colors: {
                ...theme.colors,
                neutral10: '#FCE8DB',
                neutral80: '#F37021',
                primary25: '#FFF8F4',
                primary: '#F37021',
              },
            })}
          />
        </div>
        <div className='text-gray-500'>
          * 회원이 선택 가능한 배송 기간을 설정합니다. 회원은 설정된 배송 기간만 선택 가능합니다.
        </div>
        <div className='text-gray-500'>
          * 추가 선택시 사용자가 원하는 배송 기간을 추가할 수 있습니다.
        </div>
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
              //   { label: '5주마다', selectData: '5' },
            ]}
            name='weekValues'
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
            name='dayValues'
            onChange={handleChangeCheckboxValue}
          />
        </div>
        <div className='text-gray-500'>
          * 사용자가 선택한 요일에만 회원은 배송일을 선택할 수 있습니다.
        </div>
        <div className='text-gray-500'>* 회원은 여러 요일을 선택할 수 있습니다.</div>
        <div className='text-gray-500'>* 해당 주기의 첫번째 주 마다 배송이 진행됩니다.</div>
      </div>
    </div>
  );
};

export default SubscriptionTypeMonth;
