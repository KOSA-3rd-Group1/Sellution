import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ListComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const itemsPerPage = 5; // 카테고리는 페이지당 5개
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const handleRowClick = (id) => {
    navigate(`/product/category/${id}`);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
        params: {
          page: currentPage - 1,
          size: itemsPerPage,
        },
      })
      .then((response) => {
        console.log('API Response:', response.data);
        setCategories(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      })
      .catch((error) => {
        console.error('There was an error fetching the categories!', error);
      });
  }, [currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(categories.map((category) => category.categoryId));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-full flex flex-col'>
        <div className='flex justify-between items-center mb-2'>
          <div className='flex items-center'>
            총 {totalElements}건 / 선택 {selectedItems.length}건
          </div>
          <div className='flex items-center'>
            <Link
              to='add'
              className='mx-1 px-4 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
            >
              카테고리 추가
            </Link>
            <Link
              to='edit'
              className='mx-1 px-4 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
            >
              카테고리 수정
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
                    <select className='border p-1 text-sm rounded'>
                      <option value=''>전체</option>
                      <option value='Y'>표시</option>
                      <option value='N'>미표시</option>
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
                  <td className='p-2 text-center'>{indexOfFirstItem + index + 1}</td>
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
