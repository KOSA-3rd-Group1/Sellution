import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useCategoryList from '@/client/business/product/category/useCategoryList';
import AlertModal from '@/client/layout/common/modal/AlertModal';

const ListComponent = () => {
  const {
    currentPage,
    selectedItems,
    selectAll,
    categories,
    totalPages,
    totalElements,
    isVisibleFilter,
    error,
    handleIsVisibleFilterChange,
    paginate,
    handleSelectAll,
    handleSelectItem,
    handleDeleteSelectedCategories,
    handleRowClick,
  } = useCategoryList();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const handleDeleteClick = () => {
    if (selectedItems.length === 0) {
      setModalConfig({
        type: 'error',
        title: '선택 오류',
        message: '삭제할 카테고리를 선택해주세요.',
      });
      setIsModalOpen(true);
      return;
    }

    setModalConfig({
      type: 'warning',
      title: '카테고리 삭제',
      message: `선택한 ${selectedItems.length}개의 카테고리를 삭제하시겠습니까?`,
      onConfirm: async () => {
        await handleDeleteSelectedCategories();
        setModalConfig({
          type: 'success',
          title: '삭제 완료',
          message: '선택한 카테고리가 성공적으로 삭제되었습니다.',
          onClose: () => window.location.reload(),
        });
        setIsModalOpen(true);
      },
    });
    setIsModalOpen(true);
  };

  const itemsPerPage = 5;

  const renderPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    return (
      <div className='flex justify-end'>
        <button
          onClick={() => paginate(currentPage - 1)}
          className='mx-1 px-3 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`mx-1 px-3 py-1 rounded border ${
              currentPage === number
                ? 'bg-brandOrange text-white'
                : 'border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          className='mx-1 px-3 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  return (
    <div className='w-full h-full flex flex-col'>
      <div className='h-[45px] px-5 py-2 flex justify-between items-center bg-white text-sm font-medium text-gray-700 border-b-2 border-b-[#CCCDD3]'>
        <div>
          총 {totalElements}건 / 선택 {selectedItems.length}건
        </div>
        <div className='flex items-center'>
          <button
            onClick={handleDeleteClick}
            className='mx-1 px-4 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
          >
            선택 카테고리 삭제
          </button>
          <Link
            to='add'
            className='mx-1 px-4 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
          >
            카테고리 추가
          </Link>
        </div>
      </div>

      <div className='w-full relative overflow-x-auto overflow-y-auto'>
        <table className='min-w-full text-sm text-gray-500 table-fixed'>
          <thead className='sticky top-0 z-30 w-full h-[82px] text-xs text-gray-700 uppercase bg-gray-50'>
            <tr className='relative'>
              <th className='sticky min-w-24 w-24 max-w-24 h-full p-3 z-20 left-[0px] bg-gray-50'>
                <input
                  type='checkbox'
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                />
              </th>
              <th>NO.</th>
              <th>카테고리명</th>
              <th>상품 수</th>
              <th>
                쇼핑몰 표시 여부
                <div className='mt-1'>
                  <select
                    className='border p-1 text-sm rounded-lg text-gray-600'
                    value={isVisibleFilter}
                    onChange={handleIsVisibleFilterChange}
                  >
                    <option value='전체'>전체</option>
                    <option value='표시'>표시</option>
                    <option value='미표시'>미표시</option>
                  </select>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className='relative w-full text-sm bg-white border-y border-y-[#CCCDD3] font-light'>
            {categories.map((category, index) => (
              <tr
                key={category.categoryId}
                className='hover:bg-brandOrange-light cursor-pointer relative w-full min-h-14 h-14 max-h-14 border-b border-b-[#F1F1F4] group'
                onClick={() => handleRowClick(category.categoryId)}
              >
                <td className='p-2 text-center'>
                  <input
                    type='checkbox'
                    checked={selectedItems.includes(category.categoryId)}
                    onChange={() => handleSelectItem(category.categoryId)}
                    onClick={(e) => e.stopPropagation()}
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                  />
                </td>
                <td className='p-2 text-center'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className='p-2 text-center'>{category.name}</td>
                <td className='p-2 text-center'>{category.productCount}</td>
                <td className='p-2 text-center text-brandOrange'>
                  {category.isVisible === 'Y' ? '표시' : '미표시'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
      </div>
      <div className='mt-4'>{renderPageNumbers()}</div>
      <AlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default ListComponent;
