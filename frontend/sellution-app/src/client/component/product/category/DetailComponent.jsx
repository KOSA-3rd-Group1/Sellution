import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import axios from 'axios';

const DetailComponent = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: '',
    isVisible: 'Y',
    productCount: 0,
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`,
        );
        setCategory(response.data);
      } catch (error) {
        console.error('카테고리 정보를 불러오는데 실패했습니다.', error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const moveList = () => {
    navigate('/product/category');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`);
        alert('카테고리가 성공적으로 삭제되었습니다.');
        navigate('/product/category');
      } catch (error) {
        console.error('카테고리 삭제에 실패했습니다.', error);
        alert('카테고리 삭제에 실패했습니다.');
      }
    }
  };

  const handleApplyChanges = async () => {
    const saveCategoryReq = {
      name: category.name,
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`,
        saveCategoryReq,
      );
      alert('변경사항이 적용되었습니다.');
      navigate('/product/category');
    } catch (error) {
      console.error('변경사항 적용에 실패했습니다.', error);
      alert('변경사항 적용에 실패했습니다.');
    }
  };

  return (
    <div className='relative w-full h-full flex flex-col'>
      <div className='flex-grow overflow-y-auto pb-[58px]'>
        <section className='flex-auto p-6'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>카테고리명</label>
              <input
                type='text'
                name='name'
                value={category.name}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
              />
            </div>
            <hr />
            <div>
              <label className='block text-sm font-medium text-gray-700'>쇼핑몰 표시 여부</label>
              <div className='mt-2'>
                <label className='inline-flex items-center mr-6'>
                  <input
                    type='radio'
                    className='form-radio'
                    name='isVisible'
                    value='Y'
                    checked={category.isVisible === 'Y'}
                    readOnly
                  />
                  <span className='ml-2'>표시</span>
                </label>
                <label className='inline-flex items-center'>
                  <input
                    type='radio'
                    className='form-radio'
                    name='isVisible'
                    value='N'
                    checked={category.isVisible === 'N'}
                    readOnly
                  />
                  <span className='ml-2'>미표시</span>
                </label>
              </div>
            </div>
            <hr />
            <div>
              <label className='block text-sm font-medium text-gray-700'>상품 수</label>
              <p className='mt-1 text-sm text-gray-500'>{category.productCount} 개</p>
            </div>
            <hr />
          </div>
        </section>
      </div>
      <FooterComponent
        btn1={{ label: '카테고리 삭제', event: handleDelete }}
        btn2={{ label: '변경사항 적용', event: handleApplyChanges }}
        back={{ label: '목록으로', event: moveList }}
      />
    </div>
  );
};

export default DetailComponent;
