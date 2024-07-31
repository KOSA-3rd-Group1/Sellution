import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const useCategoryDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: '',
    isVisible: 'Y',
    productCount: 0,
  });
  const [isNameChecked, setIsNameChecked] = useState(false);
  const [isDuplicateName, setIsDuplicateName] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`,
        );
        setCategory(response.data);
        setIsNameChecked(true); // 초기 데이터는 중복 확인이 된 것으로 간주
      } catch (error) {
        console.error('카테고리 정보를 불러오는데 실패했습니다.', error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const moveList = () => {
    navigate('/product/category');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
    if (name === 'name') {
      setIsNameChecked(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`);
      navigate('/product/category');
    } catch (error) {
      console.error('카테고리 삭제에 실패했습니다.', error);
    }
  };

  const checkDuplicateName = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/check`, {
        params: { name: category.name },
      });
      setIsNameChecked(true);
      setIsDuplicateName(response.data);
      return response.data;
    } catch (error) {
      console.error('카테고리 이름 중복 확인 중 오류가 발생했습니다.', error);
      return true; // 오류 발생 시 중복으로 처리
    }
  };

  const handleApplyChanges = async () => {
    if (!isNameChecked) {
      return { success: false, message: '중복 확인 후 변경사항을 저장해주세요.' };
    }

    if (isDuplicateName) {
      return { success: false, message: '중복된 카테고리 이름입니다. 다른 이름을 사용해주세요.' };
    }

    const saveCategoryReq = {
      name: category.name,
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`,
        saveCategoryReq,
      );
      return { success: true, message: '변경사항이 성공적으로 저장되었습니다.' };
    } catch (error) {
      console.error('변경사항 적용에 실패했습니다.', error);
      return { success: false, message: '변경사항 적용에 실패했습니다.' };
    }
  };

  return {
    category,
    handleInputChange,
    handleDelete,
    handleApplyChanges,
    moveList,
    checkDuplicateName,
    isNameChecked,
    isDuplicateName,
  };
};

export default useCategoryDetail;
