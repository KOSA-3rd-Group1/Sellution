import { useState, useRef, useEffect } from 'react';
import { PaletteIcon } from '@/client/utility/assets/Icons';

const sampleThemeColors = {
  Rose: 'bg-[#fda4af]',
  Pink: 'bg-[#f0abfc]',
  Orange: 'bg-[#fce8db]',
  Yellow: 'bg-[#fde047]',
  Amber: 'bg-[#fcd34d]',
  Lime: 'bg-[#bef264]',
  Green: 'bg-[#86efac]',
  Teal: 'bg-[#5eead4]',
  Cyan: 'bg-[#67e8f9]',
  Blue: 'bg-[#93c5fd]',
  Indigo: 'bg-[#a5b4fc]',
  Fuchsia: 'bg-[#f0abfc]',
  Purple: 'bg-[#d8b4fe]',
  Stone: 'bg-[#d6d3d1]',
};

const ColorPalette = ({ themeColor, onDataChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleColorClick = (color) => {
    onDataChange('themeColor', color);
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
        // className={`w-20 h-10 ${data.midBgColor} rounded-md border border-gray-300`}
        className={`w-20 h-10 bg-accent rounded-md border border-gray-300`}
        title={themeColor}
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
          <div className='origin-top-right absolute top-[-17px] right-[-5px] mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10'>
            <div className='py-1' role='menu' aria-orientation='horizontal'>
              <div className='flex px-4 py-2'>
                {Object.entries(sampleThemeColors).map(([name, sampleColor]) => (
                  <button
                    key={name}
                    className={`w-8 h-8 ${sampleColor} 
                               hover:ring-2 hover:ring-offset-2 hover:ring-opacity-50 
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50
                               flex-shrink-0 mx-1 rounded-full`}
                    onClick={() => handleColorClick(name)}
                    title={name}
                  />
                ))}

                {/* {colors.map((color) => (
                  <button
                    key={color.name}
                    className={`w-8 h-8 ${color.sampleColor} 
                               hover:ring-2 hover:ring-offset-2 hover:ring-opacity-50 
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50
                               flex-shrink-0 mx-1 rounded-full`}
                    onClick={() => handleColorClick(color)}
                    title={color.name}
                  />
                ))} */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPalette;
