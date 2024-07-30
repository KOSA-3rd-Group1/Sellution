import { useState } from 'react';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import Category from '../layout/partials/Category';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, LeftArrowIcon, MenuIcon } from '../utility/assets/Icons';

const MenuCategoryHeaderNav = ({ title, categoryList, onCategoryClick }) => {
  const clientName = useCompanyInfoStore((state) => state.name);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  const [isCategoryMenuVisible, setIsCategoryMenuVisible] = useState(false);
  const toggleCategoryMenu = () => {
    setIsCategoryMenuVisible((prev) => !prev);
  };

  return (
    <header className='w-full fixed top-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-lg h-14 flex justify-between items-center bg-white px-2 shadow-md'>
      <div className='flex items-center space-x-4'>
        <button className='header-icon header-prev' onClick={handleBack}>
          <LeftArrowIcon className={'w-6 h-6 stroke-current text-gray-600'} />
        </button>
        <button className='header-icon category-button' onClick={toggleCategoryMenu}>
          <MenuIcon
            className={'category-button w-6 h-6 stroke-current text-gray-600 cursor-pointer'}
          />
        </button>
      </div>
      <span className='menu-title absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-center w-[55%]'>
        {title}
      </span>
      <Link to={`/shopping/${clientName}/home`}>
        <div className='header-icon header-gohome'>
          <HomeIcon className={'w-6 h-6 fill-current text-gray-600'} />
        </div>
      </Link>
      {isCategoryMenuVisible && (
        <Category categoryList={categoryList} onCategoryClick={onCategoryClick} />
      )}
    </header>
  );
};

export default MenuCategoryHeaderNav;
