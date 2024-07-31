import React from 'react';
import { useState } from 'react';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import useCategoryAdd from '@/client/business/product/category/useCategoryAdd';
import AlertModal from '@/client/layout/common/modal/AlertModal';

const AddComponent = () => {
  const { categoryName, handleCategoryNameChange, checkDuplicate, handleSubmit, moveList } =
    useCategoryAdd();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const handleCheckDuplicate = async () => {
    const isDuplicate = await checkDuplicate();
    if (isDuplicate) {
      setModalConfig({
        type: 'error',
        title: '중복 확인',
        message: '이미 존재하는 카테고리입니다. 다른 이름을 사용해주세요.',
      });
    } else {
      setModalConfig({
        type: 'success',
        title: '중복 확인',
        message: '사용 가능한 카테고리 이름입니다. ',
      });
    }
    setIsModalOpen(true);
  };

  const handleCategorySubmit = async () => {
    const result = await handleSubmit();
    setModalConfig({
      type: result.type,
      title: result.type === 'success' ? '등록 완료' : '등록 실패',
      message: result.message,
      onClose: result.type === 'success' ? moveList : () => setIsModalOpen(false),
    });
    setIsModalOpen(true);
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
                onClick={handleCheckDuplicate}
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
        btn2={{ label: '카테고리 등록', event: handleCategorySubmit }}
      />
      <AlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default AddComponent;
