import React, { useState } from 'react';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import useCategoryDetail from '@/client/business/product/category/useCategoryDetail';
import AlertModal from '@/client/layout/common/modal/AlertModal';

const DetailComponent = () => {
  const {
    category,
    handleInputChange,
    handleDelete,
    handleApplyChanges,
    moveList,
    checkDuplicateName,
    isNameChecked,
    isDuplicateName,
  } = useCategoryDetail();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const handleCheckDuplicate = async () => {
    const isDuplicate = await checkDuplicateName();
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

  const handleSaveChanges = async () => {
    if (!isNameChecked) {
      setModalConfig({
        type: 'error',
        title: '중복 확인 필요',
        message: '중복 확인 후 변경사항을 저장해주세요.',
      });
      setIsModalOpen(true);
      return;
    }

    const result = await handleApplyChanges();
    setModalConfig({
      type: result.success ? 'success' : 'error',
      title: result.success ? '저장 완료' : '저장 실패',
      message: result.message,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = () => {
    setModalConfig({
      type: 'warning',
      title: '카테고리 삭제',
      message: '정말로 이 카테고리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      onConfirm: handleDelete,
    });
    setIsModalOpen(true);
  };

  return (
    <div className='relative w-full h-full flex flex-col'>
      <div className='flex-grow overflow-y-auto pb-[58px]'>
        <section className='flex-auto p-6'>
          <div className='space-y-6'>
            <div className='flex items-center'>
              <label className='w-1/4 text-sm font-medium'>카테고리명</label>
              <div className='flex-1'>
                <input
                  type='text'
                  name='name'
                  value={category.name}
                  onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
        btn1={{ label: '카테고리 삭제', event: handleDeleteClick }}
        btn2={{ label: '변경사항 적용', event: handleSaveChanges }}
        back={{ label: '목록으로', event: moveList }}
      />
      <AlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default DetailComponent;
