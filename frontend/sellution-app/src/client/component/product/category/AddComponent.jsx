import React, { useState } from 'react';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import useCategoryAdd from '@/client/business/product/category/useCategoryAdd';
import AlertModal from '@/client/layout/common/modal/AlertModal';
import { InfoInput } from '@/client/layout/common/Input';

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
        type: 'warning',
        title: '카테고리 중복',
        message: '이미 존재하는 카테고리입니다. 다른 이름을 입력해주세요.',
      });
    } else {
      setModalConfig({
        type: 'success',
        title: '중복 확인',
        message: '사용 가능한 카테고리 이름입니다.',
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
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto'>
        <div className='flex flex-col gap-10 px-4'>
          <div className='w-3/5'>
            <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
              <div>카테고리 추가</div>
            </div>
            <ul className='w-full min-w-fit flex flex-col text-sm border-t-2'>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>카테고리명</div>
                <div className='flex-1 min-w-64 text-xs flex items-center gap-2'>
                  <InfoInput
                    value={categoryName}
                    onChange={handleCategoryNameChange}
                    placeholder='카테고리명을 입력하세요.'
                  />
                  <button
                    className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600'
                    onClick={handleCheckDuplicate}
                  >
                    중복 확인
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <FooterComponent
        btn1={{ label: '취소', event: moveList }}
        btn2={{ label: '카테고리 등록', event: handleCategorySubmit }}
      />
      <AlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default AddComponent;
