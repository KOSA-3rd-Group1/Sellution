import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useProductAdd = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const shopCompanyStorage = localStorage.getItem('shop-company-storage');
    if (shopCompanyStorage) {
      const { state } = JSON.parse(shopCompanyStorage);
      if (state && state.companyId) {
        setCompanyId(state.companyId);
        console.log(state.companyId);
      }
    }
  }, []);

  const moveList = () => {
    navigate('/product/category');
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
    setIsChecked(false);
    setIsAvailable(false);
  };

  const checkDuplicate = async () => {
    if (!companyId) {
      alert('Company ID is not available. Please try again later.');
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/check`, {
        params: { name: categoryName, companyId: companyId },
      });
      setIsChecked(true);
      if (response.data) {
        alert('이미 존재하는 카테고리입니다.');
        setIsAvailable(false);
      } else {
        alert('사용 가능한 카테고리명입니다.');
        setIsAvailable(true);
      }
    } catch (error) {
      console.error('중복 확인 중 오류 발생:', error);
      alert('중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async () => {
    if (!isChecked || !isAvailable) {
      alert('중복 확인을 먼저 해주세요.');
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
      alert('카테고리가 등록되었습니다.');
      moveList();
    } catch (error) {
      console.error('카테고리 등록 중 오류 발생:', error);
      alert('카테고리 등록에 실패했습니다.');
    }
  };

  return {
    categoryName,
    isChecked,
    isAvailable,
    handleCategoryNameChange,
    checkDuplicate,
    handleSubmit,
    moveList,
  };
};

export default useProductAdd;
