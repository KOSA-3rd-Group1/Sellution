import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useCategoryAdd = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const shopCompanyStorage = localStorage.getItem('shop-company-storage');
    if (shopCompanyStorage) {
      const { state } = JSON.parse(shopCompanyStorage);
      if (state && state.companyId) {
        setCompanyId(state.companyId);
      }
    }
  }, []);

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
    setIsChecked(false);
    setIsAvailable(false);
  };

  const checkDuplicate = async () => {
    if (!companyId) {
      setErrorMessage('Company ID is not available. Please try again later.');
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/check`, {
        params: { name: categoryName, companyId: companyId },
      });
      setIsChecked(true);
      if (response.data) {
        setIsAvailable(false);
        setErrorMessage('이미 존재하는 카테고리입니다.');
      } else {
        setIsAvailable(true);
        setErrorMessage('');
      }
    } catch (error) {
      console.error('중복 확인 중 오류 발생:', error);
    }
  };

  const handleSubmit = async () => {
    if (!isChecked || !isAvailable) {
      return;
    }
    if (!companyId) {
      alert('Company ID is not available. Please try again later.');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
        name: categoryName,
        companyId: companyId,
      });
      return true;
      // moveList();
    } catch (error) {
      console.error('카테고리 등록 중 오류 발생:', error);
      setErrorMessage('카테고리 등록에 실패했습니다.');
    }
  };

  const moveList = () => {
    navigate('/product/category');
  };

  return {
    categoryName,
    handleCategoryNameChange,
    checkDuplicate,
    handleSubmit,
    moveList,
    errorMessage,
  };
};

export default useCategoryAdd;
