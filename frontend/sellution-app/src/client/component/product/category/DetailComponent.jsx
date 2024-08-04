import React, { useState } from 'react';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import useCategoryDetail from '@/client/business/product/category/useCategoryDetail';
import AlertModal from '@/client/layout/common/modal/AlertModal';
import { InfoInput } from '@/client/layout/common/Input';

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
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto'>
        <div className='flex flex-col gap-10 px-4'>
          <div className='w-3/5'>
            <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
              <div>카테고리 상세</div>
            </div>
            <ul className='w-full min-w-fit flex flex-col text-sm border-t-2'>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>카테고리명</div>
                <div className='flex-1 min-w-64 text-xs flex items-center gap-2'>
                  <InfoInput
                    value={category.name}
                    onChange={(e) => handleInputChange(e)}
                    name='name'
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
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>쇼핑몰 표시 여부</div>
                <div className='flex-1 min-w-64 text-xs'>
                  <p className='mt-1 text-sm text-brandOrange'>
                    {category.isVisible === 'Y' ? '표시' : '미표시'}
                  </p>
                </div>
              </li>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>상품 수</div>
                <div className='flex-1 min-w-64 text-xs'>
                  <p className='mt-1 text-sm text-gray-500'>{category.productCount} 개</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
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
