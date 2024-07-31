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

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`,
        );
        setCategory(response.data);
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
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`);
        alert('카테고리가 성공적으로 삭제되었습니다.');
        navigate('/product/category');
      } catch (error) {
        console.error('카테고리 삭제에 실패했습니다.', error);
        alert('카테고리 삭제에 실패했습니다.');
      }
    }
  };

  const handleApplyChanges = async () => {
    const saveCategoryReq = {
      name: category.name,
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`,
        saveCategoryReq,
      );
      alert('변경사항이 적용되었습니다.');
      navigate('/product/category');
    } catch (error) {
      console.error('변경사항 적용에 실패했습니다.', error);
      alert('변경사항 적용에 실패했습니다.');
    }
  };

  return {
    category,
    handleInputChange,
    handleDelete,
    handleApplyChanges,
    moveList,
  };
};

export default useCategoryDetail;
