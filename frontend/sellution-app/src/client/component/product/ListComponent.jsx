import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useProductList } from '@/client/business/product/useProductList';
import TableProduct from '@/client/layout/common/table/TableProduct';
import { EventBtn } from '@/client/layout/common/Button';
import AlertModal from '@/client/layout/common/modal/AlertModal';

const ListComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    fetchProducts,
    updatePage,
  } = useProductList();

  const [alertModal, setAlertModal] = useState({ isOpen: false, type: '', title: '', message: '' });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get('page') || '1', 10);
    setTableState((prev) => ({ ...prev, currentPage: page }));
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, [tableState.currentPage]);

  const openAlertModal = (type, title, message) => {
    setAlertModal({ isOpen: true, type, title, message });
  };

  const closeAlertModal = () => {
    setAlertModal({ isOpen: false, type: '', title: '', message: '' });
  };

  const handleDeleteProductBtn = () => {
    if (selectedCount === 0) {
      openAlertModal('error', '선택된 상품 없음', '삭제할 상품을 선택해주세요.');
      return;
    }
    openAlertModal(
      'warning',
      '상품 삭제 확인',
      `선택한 ${selectedCount}개의 상품을 삭제하시겠습니까?`,
    );
  };

  const handleRowClick = (productId) => {
    navigate(`/product/${productId}?fromPage=${tableState.currentPage}`);
  };

  const handleAlertConfirm = async () => {
    if (alertModal.type === 'warning') {
      closeAlertModal();
      try {
        await handleDeleteProductsBtn(); // useProductList에서 제공하는 함수 사용
        openAlertModal('success', '상품 삭제 완료', '선택한 상품이 성공적으로 삭제되었습니다.');
        fetchProducts(); // 상품 목록 새로고침
      } catch (error) {
        openAlertModal('error', '상품 삭제 실패', '상품 삭제 중 오류가 발생했습니다.');
      }
    } else {
      closeAlertModal();
    }
  };

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
          onClick={() => updatePage(tableState.currentPage - 1)}
          className='mx-1 px-3 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
          disabled={tableState.currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((number) => (
          <button
            key={number}
            onClick={() => updatePage(number)}
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
          onClick={() => updatePage(tableState.currentPage + 1)}
          className='mx-1 px-3 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
          disabled={tableState.currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

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
                <EventBtn
                  label={'상품 등록'}
                  onClick={handleAddProductBtn}
                  className='mx-1 px-4 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
                />
                <EventBtn
                  label={'상품 삭제'}
                  onClick={handleDeleteProductBtn}
                  className='mx-1 px-4 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
                />
              </div>
            }
            onRowClick={handleRowClick}
          />
        </div>
        <div className='h-12 flex-none flex justify-end items-end '>{renderPageNumbers()}</div>
      </section>
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlertModal}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onConfirm={handleAlertConfirm}
      />
    </div>
  );
};

export default ListComponent;
