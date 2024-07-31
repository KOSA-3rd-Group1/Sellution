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
      setErrorMessage('회사 ID를 사용할 수 없습니다. 나중에 다시 시도해주세요.');
      return { type: 'error', message: '회사 ID를 사용할 수 없습니다. 나중에 다시 시도해주세요.' };
    }
    if (!categoryName.trim()) {
      return { type: 'error', message: '카테고리명을 입력해주세요.' };
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/check`, {
        params: { name: categoryName, companyId: companyId },
      });
      setIsChecked(true);
      if (response.data.exists) {
        // 서버 응답 구조에 따라 수정
        setIsAvailable(false);
        return {
          type: 'error',
          message: '이미 존재하는 카테고리입니다. 다른 이름을 사용해주세요.',
        };
      } else {
        setIsAvailable(true);
        return { type: 'success', message: '사용 가능한 카테고리 이름입니다.' };
      }
    } catch (error) {
      console.error('중복 확인 중 오류 발생:', error);
      return { type: 'error', message: '중복 확인 중 오류가 발생했습니다.' };
    }
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      return { type: 'error', message: '카테고리명을 입력해주세요.' };
    }
    if (!isChecked) {
      return { type: 'warning', message: '중복 확인을 한 후 카테고리 등록을 해주세요.' };
    }
    if (!isAvailable) {
      return {
        type: 'error',
        message: '중복된 카테고리 이름입니다. 카테고리 이름을 다시 입력해주세요.',
      };
    }
    if (!companyId) {
      return { type: 'error', message: 'Company ID is not available. Please try again later.' };
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
        name: categoryName,
        companyId: companyId,
      });
      return { type: 'success', message: '카테고리가 성공적으로 등록되었습니다.' };
    } catch (error) {
      console.error('카테고리 등록 중 오류 발생:', error);
      return { type: 'error', message: '카테고리 등록에 실패했습니다.' };
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
