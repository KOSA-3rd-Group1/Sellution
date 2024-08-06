import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const useCategoryList = () => {
  const [selectedRows, setSelectedRows] = useState({});
  const itemsPerPage = 5;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [companyId, setCompanyId] = useState(null);
  const [isVisibleFilter, setIsVisibleFilter] = useState('전체');
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(initialPage);

  const mapFilterValues = {
    isVisible: {
      전체: null,
      표시: 'Y',
      미표시: 'N',
    },
  };

  useEffect(() => {
    const shopCompanyStorage = localStorage.getItem('userInfo');
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

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      navigate(`/product/category?page=${pageNumber}`, { replace: true });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleIsVisibleFilterChange = (e) => {
    setIsVisibleFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectAll = useCallback(() => {
    const allSelected =
      categories.length > 0 && Object.keys(selectedRows).length === categories.length;
    if (allSelected) {
      setSelectedRows({});
    } else {
      const newSelectedRows = {};
      categories.forEach((category) => {
        newSelectedRows[category.categoryId] = true;
      });
      setSelectedRows(newSelectedRows);
    }
  }, [categories, selectedRows]);

  const handleSelectRow = useCallback((categoryId) => {
    setSelectedRows((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }, []);

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

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
        params,
      });

      if (response.data.content.length === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
        return;
      }

      setCategories(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setSelectedRows({}); // 선택된 행 초기화
      setError(null);
    } catch (error) {
      console.error('There was an error fetching the categories!', error);
      setError('카테고리를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteCategories = async () => {
    const selectedCategoryIds = Object.keys(selectedRows).filter((key) => selectedRows[key]);

    if (selectedCategoryIds.length === 0) {
      return;
    }

    try {
      for (const categoryId of selectedCategoryIds) {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`);
      }
      setSelectedRows({});
      fetchCategories();
    } catch (error) {
      console.error('Error deleting categories:', error);
      throw error;
    }
  };

  const handleRowClick = (id) => {
    navigate(`/product/category/${id}?page=${currentPage}`);
  };

  return {
    currentPage,
    selectedRows,
    categories,
    totalPages,
    totalElements,
    isVisibleFilter,
    error,
    handleIsVisibleFilterChange,
    paginate,
    handleSelectAll,
    handleSelectRow,
    handleDeleteCategories,
    handleRowClick,
    fetchCategories,
    selectedCount: Object.values(selectedRows).filter(Boolean).length,
  };
};

export default useCategoryList;
