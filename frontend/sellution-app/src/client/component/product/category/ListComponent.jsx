import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useCategoryList from '@/client/business/product/category/useCategoryList';

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
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-full flex flex-col'>
        <div className='flex justify-between items-center mb-2'>
          <div className='flex items-center'>
            총 {totalElements}건 / 선택 {selectedItems.length}건
          </div>
          <div className='flex items-center'>
            <button
              onClick={handleDeleteSelectedCategories}
              className='mx-1 px-4 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
            >
              선택 삭제
            </button>
            <Link
              to='add'
              className='mx-1 px-4 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
            >
              카테고리 추가
            </Link>
          </div>
        </div>
        <hr className='mb-4' />
        <div className='w-full h-full overflow-auto'>
          <table className='min-w-full text-sm'>
            <thead className='sticky top-0 bg-white'>
              <tr className='bg-gray-100'>
                <th className='p-2 text-center'>
                  <input type='checkbox' checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th className='p-2 text-center'>NO.</th>
                <th className='p-2 text-center'>카테고리명</th>
                <th className='p-2 text-center'>상품 수</th>
                <th className='p-2 text-center'>
                  쇼핑몰 표시 여부
                  <div className='mt-1'>
                    <select
                      className='border p-1 text-sm rounded'
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
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category.categoryId}
                  className='hover:bg-brandOrange-light cursor-pointer'
                  onClick={() => handleRowClick(category.categoryId)}
                >
                  <td className='p-2 text-center'>
                    <input
                      type='checkbox'
                      checked={selectedItems.includes(category.categoryId)}
                      onChange={() => handleSelectItem(category.categoryId)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className='p-2 text-center'>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
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
      </section>
    </div>
  );
};

export default ListComponent;
