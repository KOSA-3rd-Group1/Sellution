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
    const shopCompanyStorage = localStorage.getItem('userInfo');
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
      return true; // 중복으로 처리
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/check`, {
        params: { name: categoryName, companyId: companyId },
      });
      setIsChecked(true);
      if (response.data) {
        setIsAvailable(false);
        setErrorMessage('이미 존재하는 카테고리입니다.');
        return true; // 중복
      } else {
        setIsAvailable(true);
        setErrorMessage('');
        return false; // 중복 아님
      }
    } catch (error) {
      console.error('중복 확인 중 오류 발생:', error);
      setIsChecked(true);
      setIsAvailable(false);
      setErrorMessage('중복 확인 중 오류가 발생했습니다.');
      return true; // 오류 발생 시 중복으로 처리
    }
  };

  const handleSubmit = async () => {
    if (!isChecked || !isAvailable) {
      return false;
    }
    if (!companyId) {
      setErrorMessage('Company ID is not available. Please try again later.');
      return false;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
        name: categoryName,
        companyId: companyId,
      });
      return true;
    } catch (error) {
      console.error('카테고리 등록 중 오류 발생:', error);
      setErrorMessage('카테고리 등록에 실패했습니다.');
      return false;
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
    isChecked,
    isAvailable,
  };
};

export default useCategoryAdd;
