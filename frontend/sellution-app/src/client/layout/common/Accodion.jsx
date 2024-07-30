import React from 'react';
import { ChevronUpIcon } from '@/client/utility/assets/Icons';
import useSaleSettingStore from '../../store/stores/useSaleSettingStore';

const Accordion = ({ items, groupName }) => {
  const saleTypes = useSaleSettingStore((state) => state.saleTypes);
  const setSaleTypes = useSaleSettingStore((state) => state.setSaleTypes);

  //   const [openIndex, setOpenIndex] = useState(openIndexNumber);
  const handleItemClick = (index) => {
    // setOpenIndex(openIndex === index ? null : index);
    setSaleTypes({ [groupName]: index });
  };

  const hasContent = (content) => {
    if (typeof content === 'string') {
      return content.trim() !== '';
    }
    if (React.isValidElement(content)) {
      return true;
    }
    return content != null && content !== false;
  };

  //   useEffect(() => {
  //     setOpenIndex(openIndexNumber);
  //   }, [openIndexNumber]);

  return (
    <div className='w-full mx-auto'>
      {items.map((item, index) => {
        // const isOpen = openIndex === index;
        const isOpen = saleTypes[groupName] === index;
        const { title, content, guidance, disabled } = item;
        const contentExists = hasContent(content);

        return (
          <div key={index} className={`mb-4 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
              className={`flex justify-between items-center w-full p-4 text-left transition-colors rounded-md border 
                ${isOpen ? 'bg-brandOrange-light hover:bg-[#FFDEC9] border-brandOrange-light' : 'bg-gray-50 hover:bg-gray-100 border-gray-300'}
                ${disabled ? 'cursor-not-allowed border-gray-300 bg-[#E3E3E3] hover:bg-[#E3E3E3] ' : ''}`}
              onClick={disabled ? undefined : () => handleItemClick(index)}
              disabled={disabled}
            >
              <div className='flex items-center space-x-3 flex-grow'>
                <input
                  type='radio'
                  id={`accordion-${groupName}-${index}`}
                  name={`accordion-${groupName}-group`}
                  className='radio checked:bg-brandOrange mr-2 h-5 w-5 '
                  checked={isOpen}
                  onChange={() => {}}
                  onClick={(e) => e.stopPropagation()}
                  disabled={disabled}
                />
                <div className='flex items-center flex-wrap'>
                  <label
                    htmlFor={`accordion-${groupName}-${index}`}
                    className='font-medium text-gray-900 leading-none mr-2'
                  >
                    {title}
                  </label>
                  {guidance && (
                    <span className='text-sm text-gray-500 leading-none'>{guidance}</span>
                  )}
                </div>
              </div>
              <ChevronUpIcon
                className={`h-5 w-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && !disabled && contentExists && (
              <div className='mt-2 p-4 border border-brandOrange rounded-md'>{content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
