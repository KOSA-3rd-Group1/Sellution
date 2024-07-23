import { useState, useRef, useEffect } from 'react';
import { PaletteIcon } from '@/client/utility/assets/Icons';

const colors = [
  {
    name: 'rose',
    textColor: 'text-rose-700',
    darkBgColor: 'bg-rose-900',
    midBgColor: 'bg-rose-200',
    lightBgColor: 'bg-rose-50',
  },
  {
    name: 'pink',
    textColor: 'text-pink-700',
    darkBgColor: 'bg-pink-900',
    midBgColor: 'bg-pink-200',
    lightBgColor: 'bg-pink-50',
  },
  {
    name: 'orange',
    textColor: 'text-brandOrange',
    darkBgColor: 'bg-brandOrange',
    midBgColor: 'bg-brandOrange-light',
    lightBgColor: 'bg-[#FFF8F4]',
  },
  {
    name: 'yellow',
    textColor: 'text-yellow-700',
    darkBgColor: 'bg-yellow-900',
    midBgColor: 'bg-yellow-200',
    lightBgColor: 'bg-yellow-50',
  },
  {
    name: 'amber',
    textColor: 'text-amber-700',
    darkBgColor: 'bg-amber-900',
    midBgColor: 'bg-amber-200',
    lightBgColor: 'bg-amber-50',
  },
  {
    name: 'lime',
    textColor: 'text-lime-700',
    darkBgColor: 'bg-lime-900',
    midBgColor: 'bg-lime-200',
    lightBgColor: 'bg-lime-50',
  },
  {
    name: 'green',
    textColor: 'text-green-700',
    darkBgColor: 'bg-green-900',
    midBgColor: 'bg-green-200',
    lightBgColor: 'bg-green-50',
  },
  {
    name: 'teal',
    textColor: 'text-teal-700',
    darkBgColor: 'bg-teal-900',
    midBgColor: 'bg-teal-200',
    lightBgColor: 'bg-teal-50',
  },
  {
    name: 'cyan',
    textColor: 'text-cyan-700',
    darkBgColor: 'bg-cyan-900',
    midBgColor: 'bg-cyan-200',
    lightBgColor: 'bg-cyan-50',
  },
  {
    name: 'blue',
    textColor: 'text-blue-700',
    darkBgColor: 'bg-blue-900',
    midBgColor: 'bg-blue-200',
    lightBgColor: 'bg-blue-50',
  },
  {
    name: 'indigo',
    textColor: 'text-indigo-700',
    darkBgColor: 'bg-indigo-900',
    midBgColor: 'bg-indigo-200',
    lightBgColor: 'bg-indigo-50',
  },
  {
    name: 'fuchsia',
    textColor: 'text-fuchsia-700',
    darkBgColor: 'bg-fuchsia-900',
    midBgColor: 'bg-fuchsia-200',
    lightBgColor: 'bg-fuchsia-50',
  },
  {
    name: 'purple',
    textColor: 'text-purple-700',
    darkBgColor: 'bg-purple-900',
    midBgColor: 'bg-purple-200',
    lightBgColor: 'bg-purple-50',
  },
  {
    name: 'stone',
    textColor: 'text-black',
    darkBgColor: 'bg-stone-900',
    midBgColor: 'bg-stone-200',
    lightBgColor: 'bg-stone-50',
  },
];

const ColorPalette = ({ data, onDataChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleColorClick = (color) => {
    onDataChange(color);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='flex justify-end items-center space-x-2'>
      <div
        className={`w-20 h-10 ${data.midBgColor} rounded-md border border-gray-300`}
        title={data.name}
      />
      <div className='relative inline-block text-left' ref={dropdownRef}>
        <button
          type='button'
          className='inline-flex items-center justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-brandOrange h-10'
          onClick={toggleDropdown}
        >
          <PaletteIcon className='mr-2 h-5 w-5 text-balck' />
          <span className='text-black'>색상 선택</span>
        </button>

        {isOpen && (
          <div className='origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10'>
            <div className='py-1' role='menu' aria-orientation='horizontal'>
              <div className='flex px-4 py-2'>
                {colors.map((color) => (
                  <button
                    key={color.name}
                    className={`w-8 h-8 ${color.midBgColor} 
                               hover:ring-2 hover:ring-offset-2 hover:ring-opacity-50 
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50
                               flex-shrink-0 mx-1 rounded-full`}
                    onClick={() => handleColorClick(color)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPalette;
