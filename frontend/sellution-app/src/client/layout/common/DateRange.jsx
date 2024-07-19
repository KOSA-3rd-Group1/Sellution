import Datepicker from 'react-tailwindcss-datepicker';

const DateRange = ({ dateRangeValue, handleChangeDateRangeValue }) => {
  return (
    <div className='w-72'>
      <Datepicker
        inputClassName='w-full py-2 px-3 rounded-lg font-bold text-sm text-gray-600 border border-gray-400 focus:outline-brandOrange'
        // containerClassName='relative mt-8'
        primaryColor={'orange'}
        i18n={'ko'}
        showShortcuts={true}
        showFooter={true}
        readOnly={true}
        useRange={true}
        configs={{
          shortcuts: {
            today: '오늘',
            yesterday: '어제',
            past: (period) => `지난 ${period} 일`,
            currentMonth: '이번달',
            pastMonth: '지난달',
          },
          footer: {
            cancel: '취소',
            apply: '조회',
          },
        }}
        value={dateRangeValue}
        onChange={handleChangeDateRangeValue}
        popperPlacement='left-end'
      />
    </div>
  );
};

export default DateRange;
