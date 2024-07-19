import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ totalDataCount }) => {
  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalDataCount / itemsPerPage);
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className='flex justify-end'>
      <button
        onClick={() => paginate(Math.max(1, currentPage - 1))}
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
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        className='mx-1 px-3 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
