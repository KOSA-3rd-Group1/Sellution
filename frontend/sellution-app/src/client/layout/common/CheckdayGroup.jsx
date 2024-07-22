import { useState } from 'react';

const CheckdayGroup = ({ className, data, options, name, onChange }) => {
  const handleButtonClick = (selectData) => {
    onChange(name, selectData);
  };

  return (
    <div className={`${className} flex flex-wrap gap-2`}>
      {options.map((option) => (
        <button
          key={`${option.selectData}_${option.label}`}
          onClick={() => handleButtonClick(option.selectData)}
          className={`
            px-3 py-2 flex flex-col justify-center items-center gap-2 text-xs font-base rounded-lg transition-colors duration-200
            ${
              data[name][option.selectData]
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          <div>{option.label}</div>
          <div>{option.selectData}</div>
        </button>
      ))}
    </div>
  );
};

export default CheckdayGroup;
