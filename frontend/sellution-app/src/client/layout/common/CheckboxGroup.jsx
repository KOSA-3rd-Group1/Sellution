import { useState } from 'react';

const CheckboxGroup = ({ className, data, options, name, onChange }) => {
  //   const initializeCheckedState = (options) => {
  //     const initialState = {};
  //     options.forEach((option) => {
  //       initialState[option.selectData] = false;
  //     });
  //     return initialState;
  //   };

  const handleCheckboxChange = (selectData) => {
    // const updateData = data.name.map((selectData) => selectData)
    // setCheckboxes((prevCheckboxes) =>
    //   prevCheckboxes.map((checkbox) =>
    //     checkbox.selectData === selectData ? { ...checkbox, checked: !checkbox.checked } : checkbox,
    //   ),
    // );
    onChange(name, selectData);
  };

  return (
    <div className={className}>
      {options.map((option) => (
        <label
          key={`${option.selectData}_${option.label}`}
          className='flex items-center space-x-3 cursor-pointer'
        >
          <div className='relative inline-block w-5 h-5'>
            <input
              type='checkbox'
              checked={data[name][option.selectData]}
              onChange={() => handleCheckboxChange(option.selectData)}
              className='absolute w-full h-full opacity-0 cursor-pointer'
            />
            <div className='w-5 h-5 border border-gray-300 rounded absolute top-0 left-0'></div>
            {data[name][option.selectData] && (
              <svg
                className='w-7 h-7 text-orange-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7'></path>
              </svg>
            )}
          </div>
          <span className='text-gray-700 text-xs'>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroup;
