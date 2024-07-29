import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useCategoryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [companyId, setCompanyId] = useState(null);
  const [isVisibleFilter, setIsVisibleFilter] = useState('전체');
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleIsVisibleFilterChange = (e) => {
    setIsVisibleFilter(e.target.value);
    setCurrentPage(1);
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
      setError(null);
    } catch (error) {
      console.error('There was an error fetching the categories!', error);
      setError('카테고리를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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

  return {
    currentPage,
    selectedItems,
    selectAll,
    categories,
    totalPages,
    totalElements,
    isVisibleFilter,
    error,
    handleIsVisibleFilterChange,
    paginate,
    handleSelectAll,
    handleSelectItem,
    handleDeleteSelectedCategories,
    handleRowClick,
  };
};

export default useCategoryList;
