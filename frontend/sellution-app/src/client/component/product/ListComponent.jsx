import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';

const ListComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [deliveryType, setDeliveryType] = useState('전체');
  const [isDiscount, setIsDiscount] = useState('전체');
  const [categoryName, setCategoryName] = useState('전체');
  const [isVisible, setIsVisible] = useState('전체');
  const [productName, setProductName] = useState('');

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, deliveryType, isDiscount, categoryName, isVisible, productName]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`);
      const categoryData = Array.isArray(response.data)
        ? response.data
        : response.data.content || [];
      setCategories(categoryData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`, {
        params: {
          page: currentPage - 1,
          size: itemsPerPage,
          deliveryType: deliveryType !== '전체' ? deliveryType : null,
          isDiscount: isDiscount !== '전체' ? isDiscount : null,
          categoryName: categoryName !== '전체' ? categoryName : null,
          isVisible: isVisible !== '전체' ? isVisible : null,
          productName: productName || null,
        },
      });
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  useEffect(() => {
    // currentPage가 변경될 때마다 스크롤을 맨 위로 초기화
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
      setSelectedItems(products.map((item) => item.productId));
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

  const handleDeleteItems = async () => {
    if (selectedItems.length === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }

    if (window.confirm('체크하신 상품을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products`, {
          data: selectedItems,
        });
        alert('상품이 삭제되었습니다.');
        fetchProducts();
        setSelectedItems([]);
        setSelectAll(false);
      } catch (error) {
        console.error('There was an error deleting the products!', error);
        alert('상품 삭제에 실패했습니다.');
      }
    }
  };

  const handleRowClick = (id) => {
    navigate(`/product/${id}`);
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
              상품 등록
            </Link>
            <button
              onClick={handleDeleteItems}
              className='mx-1 px-4 py-1 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white'
            >
              상품 삭제
            </button>
          </div>
        </div>
        <hr className='mb-4' />
        <div className='w-full h-full overflow-auto'>
          <div>
            <table className='min-w-full text-sm'>
              <thead className='sticky top-0 bg-white'>
                <tr className='bg-gray-100'>
                  <th className='p-1 text-center min-w-[50px]'>
                    <input type='checkbox' checked={selectAll} onChange={handleSelectAll} />
                  </th>
                  <th className='p-1 text-center min-w-[50px]'>No</th>
                  <th className='p-1 text-center min-w-[100px]'>상품코드</th>
                  <th className='p-1 text-center min-w-[100px]'>이미지</th>
                  <th className='p-1 text-center min-w-[200px]'>
                    상품명
                    <div className='mt-1 flex'>
                      <input
                        type='text'
                        className='border p-1 text-sm rounded flex-grow'
                        placeholder='검색'
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                      <button
                        onClick={handleSearch}
                        className='ml-1 bg-brandOrange text-white p-1 rounded'
                      >
                        <FaSearch />
                      </button>
                    </div>
                  </th>
                  <th className='p-1 text-center min-w-[150px]'>
                    카테고리명
                    <div className='mt-1'>
                      <select
                        className='border p-1 text-sm rounded'
                        value={categoryName}
                        onChange={(e) => {
                          setCategoryName(e.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value='전체'>전체</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </th>
                  <th className='p-1 text-center min-w-[150px]'>
                    쇼핑몰 표시 여부
                    <div className='mt-1'>
                      <select
                        className='border p-1 text-sm rounded'
                        value={isVisible}
                        onChange={(e) => {
                          setIsVisible(e.target.value);
                          setCurrentPage(1); // 표시 여부 변경 시 페이지를 1로 초기화
                        }}
                      >
                        <option value='전체'>전체</option>
                        <option value='Y'>표시</option>
                        <option value='N'>미표시</option>
                      </select>
                    </div>
                  </th>
                  <th className='p-1 text-center min-w-[100px]'>금액</th>
                  <th className='p-1 text-center min-w-[100px]'>재고</th>
                  <th className='p-1 text-center min-w-[150px]'>
                    배송가능 유형
                    <div className='mt-1'>
                      <select
                        className='border p-1 text-sm rounded'
                        value={deliveryType}
                        onChange={(e) => {
                          setDeliveryType(e.target.value);
                          setCurrentPage(1); // 배송 유형 변경 시 페이지를 1로 초기화
                        }}
                      >
                        <option value='전체'>전체</option>
                        <option value='ONETIME'>단건</option>
                        <option value='SUBSCRIPTION'>정기</option>
                        <option value='BOTH'>단건 + 정기</option>
                      </select>
                    </div>
                  </th>
                  <th className='p-1 text-center min-w-[200px]'>
                    전월 판매량
                    <div className='mt-1'>
                      <input
                        type='number'
                        className='border p-1 text-sm w-20 rounded'
                        placeholder='달 선택'
                      />
                    </div>
                  </th>
                  <th className='p-1 text-center min-w-[150px]'>
                    할인 적용 여부
                    <div className='mt-1'>
                      <select
                        className='border p-1 text-sm rounded'
                        value={isDiscount}
                        onChange={(e) => {
                          setIsDiscount(e.target.value);
                          setCurrentPage(1); // 할인 적용 여부 변경 시 페이지를 1로 초기화
                        }}
                      >
                        <option value='전체'>전체</option>
                        <option value='Y'>적용</option>
                        <option value='N'>미적용</option>
                      </select>
                    </div>
                  </th>
                  <th className='p-1 text-center min-w-[100px]'>할인율</th>
                  <th className='p-1 text-center min-w-[200px]'>할인 적용 후 금액</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.productId}
                    className='hover:bg-brandOrange-light cursor-pointer h-14'
                    onClick={() => handleRowClick(product.productId)}
                  >
                    <td className='p-1 text-center'>
                      <input
                        type='checkbox'
                        checked={selectedItems.includes(product.productId)}
                        onChange={() => handleSelectItem(product.productId)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className='p-1 text-center'>{index + 1}</td>
                    <td className='p-1 text-center'>{product.code}</td>
                    <td className='p-1 text-center'>
                      {product.thumbnailImage ? (
                        <img
                          src={product.thumbnailImage}
                          alt={product.name}
                          className='w-12 h-12 object-cover inline-block'
                        />
                      ) : (
                        '이미지 없음'
                      )}
                    </td>
                    <td className='p-1 text-center'>{product.name}</td>
                    <td className='p-1 text-center'>{product.categoryName}</td>
                    <td className='p-1 text-center text-brandOrange'>
                      {product.isVisible === 'Y' ? '표시' : '미표시'}
                    </td>
                    <td className='p-1 text-center'>{product.cost.toLocaleString()}원</td>
                    <td className='p-1 text-center'>{product.stock}</td>
                    <td className='p-1 text-center'>
                      {product.deliveryType === 'ONETIME'
                        ? '단건'
                        : product.deliveryType === 'SUBSCRIPTION'
                          ? '정기'
                          : '단건 + 정기'}
                    </td>
                    <td className='p-1 text-center'>{product.previousMonthSales}</td>
                    <td className='p-1 text-center '>
                      {product.isDiscount === 'Y' ? '적용' : '미적용'}
                    </td>
                    <td className='p-1 text-center'>{product.discountRate}%</td>
                    <td className='p-1 text-center text-brandOrange'>
                      {product.discountedPrice.toLocaleString()}원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <hr />
        <div className='mt-4 flex justify-end'>{renderPageNumbers()}</div>
      </section>
    </div>
  );
};

export default ListComponent;
