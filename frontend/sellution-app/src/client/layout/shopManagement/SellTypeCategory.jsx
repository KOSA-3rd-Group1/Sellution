import Select from 'react-select';
// const selectOptions = [
//   { value: 'use', label: '사용' },
//   { value: 'unused', label: '미사용' },
//   { value: 'pending', label: '대기중' },
//   { value: 'archived', label: '보관됨' },
// ];
const SellTypeCategory = ({ selectOptions, selectedOptions, handleChange }) => {
  //   const [selectedValues, setSelectedValues] = useState([]);

  //   const handleChange = (selectedOptions) => {
  //     setSelectedValues(selectedOptions);
  //   };
  console.log(selectOptions, Object.keys(selectOptions).length);

  return (
    <div className='w-full'>
      <Select
        isMulti
        isSearchable={Object.keys(selectOptions).length != 0}
        closeMenuOnSelect={false}
        className='selectItem'
        classNamePrefix='select'
        onChange={handleChange}
        options={selectOptions}
        placeholder='카테고리 선택'
        value={selectedOptions}
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
      {/* {selectedValues.length > 0 && (
        <div className='mt-4'>
          <h3 className='text-lg font-semibold'>선택된 항목:</h3>
          <ul className='list-disc pl-5'>
            {selectedValues.map((option) => (
              <li key={option.value}>{option.label}</li>
            ))}
          </ul>
        </div>
      )} */}
      <div className='text-sm text-gray-500 leading-none mt-4'>
        * 적용할 카테고리를 여러 개 선택할 수 있습니다.
      </div>
    </div>
  );
};

export default SellTypeCategory;
