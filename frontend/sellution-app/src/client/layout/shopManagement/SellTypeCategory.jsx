import Select from 'react-select';
import useSaleSettingStore from '@/client/store/stores/useSaleSettingStore';

const SellTypeCategory = () => {
  const { data, setData } = useSaleSettingStore((state) => ({
    data: state.sellTypeCategory,
    setData: state.setSellTypeCategory,
  }));

  const handleChange = (selectedOptions) => {
    setData({ selectedOptions: selectedOptions });
  };
  return (
    <div className='w-full'>
      <Select
        isMulti
        isSearchable={Object.keys(data.selectOptions).length != 0}
        closeMenuOnSelect={false}
        className='selectItem'
        classNamePrefix='select'
        onChange={handleChange}
        options={data.selectOptions}
        placeholder='카테고리 선택'
        value={data.selectedOptions}
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
      <div className='text-sm text-gray-500 leading-none mt-4'>
        * 적용할 카테고리를 여러 개 선택할 수 있습니다.
      </div>
    </div>
  );
};

export default SellTypeCategory;
