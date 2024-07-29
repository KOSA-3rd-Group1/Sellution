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
  const [companyId, setCompanyId] = useState(null);
  const [isVisibleFilter, setIsVisibleFilter] = useState('전체'); // 쇼핑몰 표시 여부 필터링 상태
  const [error, setError] = useState(null);

  const mapFilterValues = {
    isVisible: {
      전체: null,
      표시: 'Y',
      미표시: 'N',
    },
  };

  useEffect(() => {
    const shopCompanyStorage = localStorage.getItem('shop-company-storage');
    if (shopCompanyStorage) {
      const { state } = JSON.parse(shopCompanyStorage);
      if (state && state.companyId) {
        setCompanyId(state.companyId);
      }
    }
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchCategories();
    }
  }, [companyId, currentPage, isVisibleFilter]);

  const handleIsVisibleFilterChange = (e) => {
    setIsVisibleFilter(e.target.value);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  };

  const fetchCategories = async () => {
    try {
      const params = {
        companyId: companyId,
        page: currentPage - 1,
        size: itemsPerPage,
      };

      const mappedFilterValue = mapFilterValues.isVisible[isVisibleFilter];
      if (mappedFilterValue !== null) {
        params.isVisible = mappedFilterValue;
      }

      console.log('Fetching categories with params:', params);

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
        params,
      });
      console.log('API Response:', response.data);

      if (response.data.content.length === 0 && currentPage > 1) {
        // If the current page is empty and it's not the first page, go back to the previous page
        setCurrentPage((prev) => prev - 1);
        return;
      }

      setCategories(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setError(null);
    } catch (error) {
      console.error('There was an error fetching the categories!', error);
      setError('카테고리를 불러오는 중 오류가 발생했습니다.');
    }
  };

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

  const handleDeleteSelectedCategories = async () => {
    if (selectedItems.length === 0) {
      alert('삭제할 카테고리를 선택해주세요.');
      return;
    }

    const confirmDelete = window.confirm(
      `선택한 ${selectedItems.length}개의 카테고리를 정말 삭제하시겠습니까?`,
    );
    if (!confirmDelete) return;

    try {
      for (const categoryId of selectedItems) {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`);
      }
      setSelectedItems([]);
      setSelectAll(false);
      fetchCategories();
      alert('선택한 카테고리가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('There was an error deleting the categories!', error);
      alert('카테고리 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleRowClick = (id) => {
    navigate(`/product/category/${id}`);
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
