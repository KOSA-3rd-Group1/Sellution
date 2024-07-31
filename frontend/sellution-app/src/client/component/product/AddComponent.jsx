import React from 'react';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import useProductAdd from './useProductAdd';

const AddComponent = () => {
  const { categoryName, handleCategoryNameChange, checkDuplicate, handleSubmit, moveList } =
    useProductAdd();

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
