import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useProductList } from '@/client/business/product/useProductList';
import TableProduct from '@/client/layout/common/table/TableProduct';
import { EventBtn } from '@/client/layout/common/Button';

const ListComponent = () => {
  const {
    HEADERS,
    ROW_HEIGHT,
    data,
    totalDataCount,
    tableState,
    setTableState,
    handleRowEvent,
    handleAddProductBtn,
    handleDeleteProductsBtn,
    handleSelectAll,
    handleSelectRow,
    selectedRows,
    selectedCount,
  } = useProductList();

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(totalDataCount / tableState.itemsPerPage);
    let startPage = Math.max(1, tableState.currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    return (
      <div className='flex justify-end'>
        <button
          onClick={() => setTableState((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
          className='mx-1 px-3 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
          disabled={tableState.currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((number) => (
          <button
            key={number}
            onClick={() => setTableState((prev) => ({ ...prev, currentPage: number }))}
            className={`mx-1 px-3 py-1 rounded border ${
              tableState.currentPage === number
                ? 'bg-brandOrange text-white'
                : 'border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => setTableState((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
          className='mx-1 px-3 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
          disabled={tableState.currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  //

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-full flex flex-col'>
        <div className='relative text-lg flex-none mt-2 z-40'>
          <div className='flex items-center mb-4'></div>
        </div>
        <div className='flex-grow overflow-hidden'>
          <TableProduct
            HEADERS={HEADERS}
            ROW_HEIGHT={ROW_HEIGHT}
            data={data}
            totalDataCount={totalDataCount}
            tableState={tableState}
            setTableState={setTableState}
            handleRowEvent={handleRowEvent}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            selectedRows={selectedRows}
            selectedCount={selectedCount}
            startIndex={(tableState.currentPage - 1) * tableState.itemsPerPage}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn label={'상품 등록'} onClick={handleAddProductBtn} />
                <EventBtn label={'상품 삭제'} onClick={handleDeleteProductsBtn} />
              </div>
            }
          />
        </div>
        <div className='h-12 flex-none flex justify-end items-end '>{renderPageNumbers()}</div>
      </section>
    </div>
  );
};

export default ListComponent;
