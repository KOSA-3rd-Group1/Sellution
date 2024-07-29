import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import axios from 'axios';

const AddComponent = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  //const [isVisible, setIsVisible] = useState('Y'); // 'Y' for 표시, 'N' for 미표시

  useEffect(() => {
    const shopCompanyStorage = localStorage.getItem('shop-company-storage');
    if (shopCompanyStorage) {
      const { state } = JSON.parse(shopCompanyStorage);
      if (state && state.companyId) {
        setCompanyId(state.companyId);
        console.log(state.companyId);
      }
    }
  }, []);

  const moveList = () => {
    navigate('/product/category');
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
    setIsChecked(false);
    setIsAvailable(false);
  };

  const checkDuplicate = async () => {
    if (!companyId) {
      alert('Company ID is not available. Please try again later.');
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/check`, {
        params: { name: categoryName, companyId: companyId },
      });
      setIsChecked(true);
      if (response.data) {
        alert('이미 존재하는 카테고리입니다.');
        setIsAvailable(false);
      } else {
        alert('사용 가능한 카테고리명입니다.');
        setIsAvailable(true);
      }
    } catch (error) {
      console.error('중복 확인 중 오류 발생:', error);
      alert('중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async () => {
    if (!isChecked || !isAvailable) {
      alert('중복 확인을 먼저 해주세요.');
      return;
    }
    if (!companyId) {
      alert('Company ID is not available. Please try again later.');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
        name: categoryName,
        companyId: companyId,
      });
      alert('카테고리가 등록되었습니다.');
      moveList();
    } catch (error) {
      console.error('카테고리 등록 중 오류 발생:', error);
      alert('카테고리 등록에 실패했습니다.');
    }
  };

  return (
    <div className='relative w-full h-full flex flex-col'>
      <div className='flex-grow overflow-y-auto pb-[58px]'>
        <hr />
        <section className='flex-auto p-6'>
          <div className='space-y-6'>
            <div className='flex items-center'>
              <label className='w-1/4 text-sm font-medium'>카테고리명</label>
              <div className='flex-1'>
                <input
                  type='text'
                  value={categoryName}
                  onChange={handleCategoryNameChange}
                  placeholder='카테고리명을 입력하세요.'
                  className='w-full border p-2 rounded-md'
                />
              </div>
              <button
                className='ml-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600'
                onClick={checkDuplicate}
              >
                중복 확인
              </button>
            </div>
            <hr />
          </div>
        </section>
      </div>
      <FooterComponent
        btn1={{ label: '취소', event: moveList }}
        btn2={{ label: '카테고리 등록', event: handleSubmit }}
      />
    </div>
  );
};

export default AddComponent;
