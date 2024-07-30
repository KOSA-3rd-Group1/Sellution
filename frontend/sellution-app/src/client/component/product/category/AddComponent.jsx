import React from 'react';
import { useState } from 'react';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import useCategoryAdd from '@/client/business/product/category/useCategoryAdd';
import AlertModal from '@/client/layout/common/modal/AlertModal';

const AddComponent = () => {
  const AddComponent = () => {
    const {
      categoryName,
      handleCategoryNameChange,
      checkDuplicate,
      handleSubmit,
      moveList,
      isChecked,
      isAvailable,
    } = useCategoryAdd();

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
    if (!isChecked) {
      setModalConfig({
        type: 'warning',
        title: '중복 확인 필요',
        message: '중복 확인을 한 후 카테고리 등록을 해주세요.',
      });
      setIsModalOpen(true);
      return;
    }

    if (!isAvailable) {
      setModalConfig({
        type: 'error',
        title: '등록 실패',
        message: '중복된 카테고리 이름입니다. 카테고리 이름을 다시 입력해주세요.',
      });
      setIsModalOpen(true);
      return;
    }

    const isSuccess = await handleSubmit();
    if (isSuccess) {
      setModalConfig({
        type: 'success',
        title: '등록 완료',
        message: '카테고리가 성공적으로 등록되었습니다.',
        onClose: moveList,
      });
    } else {
      setModalConfig({
        type: 'error',
        title: '등록 실패',
        message: '카테고리 등록 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    }
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
