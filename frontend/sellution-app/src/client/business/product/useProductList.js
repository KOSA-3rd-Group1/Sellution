import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDebounce from '@/client/business/common/useDebounce';

const mapFilterValues = {
  isVisible: {
    표시: 'Y',
    미표시: 'N',
  },
  deliveryType: {
    단건: 'ONETIME',
    정기: 'SUBSCRIPTION',
    '단건+정기': 'BOTH',
  },
  isDiscount: {
    적용: 'Y',
    미적용: 'N',
  },
};

export const useProductList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});

  const HEADERS = useMemo(
    () => [
      {
        key: 'code',
        label: '상품코드',
        type: 'none',
        width: 'min-w-44 w-44 max-w-44',
      },
      {
        key: 'thumbnailImage',
        label: '이미지',
        type: 'none',
        width: 'min-w-44 w-44 max-w-44',
      },
      {
        key: 'name',
        label: '상품명',
        type: 'search',
        width: 'min-w-52 w-52 max-w-52',
      },
      {
        key: 'categoryName',
        label: '카테고리명',
        type: 'filter',
        options: [...categories],
        width: 'min-w-36 w-36 max-w-36',
      },
      {
        key: 'isVisible',
        label: '쇼핑몰 표시 여부',
        type: 'filter',
        options: ['표시', '미표시'],
        width: 'min-w-36 w-36 max-w-36 text-brandOrange',
      },
      {
        key: 'cost',
        label: '금액',
        type: 'none',
        width: 'min-w-36 w-36 max-w-36',
      },
      {
        key: 'stock',
        label: '재고',
        type: 'none',
        width: 'min-w-36 w-36 max-w-36',
      },
      {
        key: 'deliveryType',
        label: '배송가능 유형',
        type: 'filter',
        options: ['단건', '정기', '단건+정기'],
        width: 'min-w-36 w-36 max-w-3',
      },
      {
        key: 'isDiscount',
        label: '할인 적용 여부',
        type: 'filter',
        options: ['적용', '미적용'],
        width: 'min-w-36 w-36 max-w-36 text-brandOrange',
      },
      {
        key: 'discountRate',
        label: '할인율',
        type: 'none',
        width: 'min-w-36 w-36 max-w-36',
      },
      {
        key: 'discountedPrice',
        label: '할인 적용 후 금액',
        type: 'none',
        width: 'min-w-36 w-36 max-w-36 text-brandOrange',
      },
    ],
    [categories],
  );

  const ROW_HEIGHT = 'min-h-14 h-14 max-h-14';

  const initialTableState = HEADERS.reduce(
    (acc, header) => {
      if (header.type === 'search') acc[header.key] = '';
      if (header.type === 'filter') acc[header.key] = '전체';
      return acc;
    },
    { currentPage: 1, itemsPerPage: 10 },
  );

  const [tableState, setTableState] = useState(initialTableState);

  const debouncedTableState = useDebounce(tableState, 300);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`);
      const categoryData = Array.isArray(response.data)
        ? response.data
        : response.data.content || [];
      setCategories(categoryData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // 오류 발생 시 빈 배열로 설정
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get('page') || '1', 10);
    setTableState((prev) => ({ ...prev, currentPage: page }));
  }, [location.search]);

  const fetchProducts = async () => {
    try {
      const params = {
        page: tableState.currentPage - 1,
        size: tableState.itemsPerPage,
      };

      if (tableState.name && tableState.name !== '') {
        params.productName = tableState.name;
      }

      if (tableState.categoryName && tableState.categoryName !== '전체') {
        params.categoryName = tableState.categoryName;
      }

      if (tableState.isVisible && tableState.isVisible !== '전체') {
        params.isVisible = mapFilterValues.isVisible[tableState.isVisible];
      }

      if (tableState.deliveryType && tableState.deliveryType !== '전체') {
        params.deliveryType = mapFilterValues.deliveryType[tableState.deliveryType];
      }

      if (tableState.isDiscount && tableState.isDiscount !== '전체') {
        params.isDiscount = mapFilterValues.isDiscount[tableState.isDiscount];
      }

      console.log('Fetching products with params:', params);

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`, {
        params,
      });

      const updatedData = response.data.content.map((item) => ({
        ...item,
        isVisible: item.isVisible === 'Y' ? '표시' : '미표시',
        deliveryType:
          item.deliveryType === 'ONETIME'
            ? '단건'
            : item.deliveryType === 'SUBSCRIPTION'
              ? '정기'
              : '단건+정기',
        isDiscount: item.isDiscount === 'Y' ? '적용' : '미적용',
      }));

      setData(updatedData);
      setTotalDataCount(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching products:', error);
      setData([]);
      setTotalDataCount(0);
    }
  };

  const updatePage = (newPage) => {
    setTableState((prev) => ({ ...prev, currentPage: newPage }));
    navigate(`/product?page=${newPage}`);
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedTableState]);

  const handleRowEvent = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddProductBtn = () => {
    navigate('add');
  };

  const handleDeleteProductsBtn = async () => {
    const selectedProductIds = Object.keys(selectedRows).filter((key) => selectedRows[key]);

    if (selectedProductIds.length === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }

    const confirmDelete = window.confirm(
      `선택한 ${selectedProductIds.length}개의 상품을 삭제하시겠습니까?`,
    );

    if (confirmDelete) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products`, {
          data: selectedProductIds,
        });
        alert('선택한 상품들이 성공적으로 삭제되었습니다.');
        setSelectedRows({});
        fetchProducts();
      } catch (error) {
        console.error('Error deleting products:', error);
        alert('상품 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleSelectAll = () => {
    if (Object.values(selectedRows).every(Boolean)) {
      setSelectedRows({});
    } else {
      const newSelectedRows = {};
      data.forEach((row) => {
        newSelectedRows[row.productId] = true;
      });
      setSelectedRows(newSelectedRows);
    }
  };

  const handleSelectRow = (productId) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return {
    HEADERS,
    ROW_HEIGHT,
    data,
    totalDataCount,
    tableState,
    categories,
    setTableState,
    handleRowEvent,
    handleAddProductBtn,
    handleDeleteProductsBtn,
    handleSelectAll,
    handleSelectRow,
    selectedRows,
    updatePage,
    selectedCount: Object.values(selectedRows).filter(Boolean).length,
    fetchProducts,
  };
};
