import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ListComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 샘플 데이터
  const products = Array.from({ length: 213 }, (_, index) => ({
    id: index + 1,
    code: `PROD${index + 1}`,
    image: 'https://via.placeholder.com/50',
    name: `Product ${index + 1}`,
    category: `Category ${(index % 5) + 1}`,
    shopDisplay: Math.random() > 0.5 ? 'Y' : 'N',
    price: Math.floor(Math.random() * 100000) + 10000,
    stock: Math.floor(Math.random() * 100),
    deliveryType: ['단건', '정기', '단건+정기'][Math.floor(Math.random() * 3)],
    lastMonthSales: Math.floor(Math.random() * 1000),
    discountApplied: Math.random() > 0.7 ? '적용' : '미적용',
    discountRate: Math.floor(Math.random() * 50),
  }));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    return (
      <div className='flex justify-end'>
        <button
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          className='mx-1 px-3 py-1 rounded bg-gray-200'
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          className='mx-1 px-3 py-1 rounded bg-gray-200'
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  return (
    <div className='w-full h-full flex flex-col justify-between'>
      <section className='flex-auto bg-green-500'>
        <div>총 {products.length}건 / 선택 2건</div>
        <div>
          <button className='bg-blue-500 text-white px-4 py-2 rounded mr-2'>상품 추가</button>
          <button className='bg-red-500 text-white px-4 py-2 rounded'>상품 삭제</button>
        </div>
        <table></table>
        <Link to='productId12345' className='w-fit h-5 bg-blue-400'>
          상품 상세 이동 테스트 버튼
        </Link>
        <Link to='add' className='w-fit h-5 bg-red-400'>
          상품 등록 테스트 버튼
        </Link>
      </section>
    </div>
  );
};

export default ListComponent;
