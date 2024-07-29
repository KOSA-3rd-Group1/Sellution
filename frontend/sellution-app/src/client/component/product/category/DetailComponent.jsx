import React from 'react';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import useCategoryDetail from '@/client/business/product/category/useCategoryDetail';

const DetailComponent = () => {
  const { category, handleInputChange, handleDelete, handleApplyChanges, moveList } =
    useCategoryDetail();

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
