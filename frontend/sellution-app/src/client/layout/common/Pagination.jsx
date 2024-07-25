import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, moveToPagination }) => {
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  return (
    <div className='flex justify-end'>
      <button
        onClick={() => moveToPagination(Math.max(1, currentPage - 1))}
        className='mx-1 px-3 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </button>
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((number) => (
        <button
          key={number}
          onClick={() => moveToPagination(number)}
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
        onClick={() => moveToPagination(Math.min(totalPages, currentPage + 1))}
        className='mx-1 px-3 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
