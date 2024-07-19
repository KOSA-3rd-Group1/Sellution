const RadioButtonGroup = ({ className, data, options, name, onChange }) => {
  return (
    <div className={className}>
      {options.map((option, index) => (
        <div key={index}>
          <label className='label cursor-pointer'>
            <input
              type='radio'
              name={name}
              value={option.selectData}
              checked={data[name] === option.selectData}
              onChange={() => onChange(name, option.selectData)}
              className='radio checked:bg-brandOrange mr-2 h-5 w-5 '
            />
            <span className='label-text text-sm'>{option.label}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioButtonGroup;
