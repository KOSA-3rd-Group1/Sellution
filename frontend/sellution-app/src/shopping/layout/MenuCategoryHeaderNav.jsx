import { useState } from 'react';
import useClient from '../business/layout/useClientName';
import Category from '../layout/partials/Category';
import { Link, useNavigate } from 'react-router-dom';

const MenuCategoryHeaderNav = ({ title, categoryList, onCategoryClick }) => {
  const { clientName } = useClient();
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  const [isCategoryMenuVisible, setIsCategoryMenuVisible] = useState(false);
  const toggleCategoryMenu = () => {
    setIsCategoryMenuVisible((prev) => !prev);
  };

  return (
    <header className='fixed top-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-lg h-14 flex justify-between items-center bg-white px-2 shadow-md'>
      <div className='flex items-center space-x-4'>
        <button className='header-icon header-prev' onClick={handleBack}>
          <svg
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='w-6 h-6 stroke-current text-gray-600'
          >
            <path
              d='M5 12H19M5 12L11 6M5 12L11 18'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></path>
          </svg>
        </button>
        <button className='header-icon category-button' onClick={toggleCategoryMenu}>
          <svg
            className='category-button w-6 h-6 stroke-current text-gray-600 cursor-pointer'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#000000'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line x1='3' y1='6' x2='21' y2='6'></line>
            <line x1='3' y1='12' x2='21' y2='12'></line>
            <line x1='3' y1='18' x2='21' y2='18'></line>
          </svg>
        </button>
      </div>
      <span className='menu-title absolute left-1/2 transform -translate-x-1/2 font-bold text-lg'>
        {title}
      </span>
      <Link to={`/shopping/${clientName}/home`}>
        <div className='header-icon header-gohome'>
          <svg
            viewBox='0 0 1024 1024'
            xmlns='http://www.w3.org/2000/svg'
            className='w-6 h-6 fill-current text-gray-600'
          >
            <path d='M972 520.8c-6.4 0-12-2.4-16.8-7.2L530.4 86.4c-4.8-4.8-11.2-8-18.4-8-6.4 0-12.8 2.4-18.4 8L68.8 512c-4.8 4.8-10.4 7.2-16.8 7.2s-12-2.4-16-6.4c-4.8-4-7.2-8.8-7.2-15.2-0.8-7.2 2.4-14.4 7.2-19.2L458.4 52.8c14.4-14.4 32.8-22.4 52.8-22.4s38.4 8 52.8 22.4L988.8 480c4.8 4.8 7.2 11.2 7.2 18.4 0 7.2-4 13.6-8.8 17.6-4.8 3.2-10.4 4.8-15.2 4.8z'></path>
            <path d='M637.6 998.4v-33.6h-33.6V904c0-51.2-41.6-92-92-92-51.2 0-92 41.6-92 92v60.8h-33.6v33.6H196.8c-40.8 0-73.6-32.8-73.6-73.6V509.6c0-13.6 10.4-24 24-24s24 10.4 24 24v415.2c0 14.4 11.2 25.6 25.6 25.6h175.2v-45.6c0-77.6 63.2-140 140-140s140 63.2 140 140v45.6h175.2c14.4 0 25.6-11.2 25.6-25.6V509.6c0-13.6 10.4-24 24-24s24 10.4 24 24v415.2c0 40.8-32.8 73.6-73.6 73.6H637.6z'></path>
            <path d='M604 998.4v-48h48v48h-48z m-232 0v-48h48v48h-48z'></path>
          </svg>
        </div>
      </Link>
      {isCategoryMenuVisible && (
        <Category categoryList={categoryList} onCategoryClick={onCategoryClick} />
      )}
    </header>
  );
};

export default MenuCategoryHeaderNav;
