import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// 더미 데이터 생성 함수
const generateEachProductDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    value: index + 1,
    code: `${Math.floor(100000 + Math.random() * 900000)}`,
    label: `상품${Math.floor(100000 + Math.random() * 900000)}`,
    categoryName: ['과일', '야채', '유기농', '건조', '동결건조', '카테고리 미설정'][
      Math.floor(Math.random() * 6)
    ],
    cost: `${Math.floor(10 + Math.random() * 90)}000`,
    group: ['과일', '야채', '유기농', '건조', '동결건조', '카테고리 미설정'][
      Math.floor(Math.random() * 6)
    ],
  }));
};

const DUMMY = {
  category: [
    { value: '1', label: '과일' },
    { value: '2', label: '야채' },
    { value: '3', label: '유기농' },
    { value: '4', label: '건조' },
    { value: '5', label: '동결건조' },
  ],
};

// 개별 상품 테이블
const HEADERS = [
  {
    key: 'code',
    label: '상품 코드',
    width: 'min-w-28 w-28 max-w-28',
  },
  {
    key: 'label',
    label: '상품명',
    width: 'min-w-32 w-32 max-w-32',
  },
  {
    key: 'categoryName',
    label: '카테고리명',
    width: 'min-w-36 w-36 max-w-36',
  },
  {
    key: 'cost',
    label: '가격',
    width: 'min-w-32 w-32 max-w-32',
  },
];

export const useShopManagementSaleSetting = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});

  const [selectCategoryOptions, setSelectCategoryOptioins] = useState({});
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState();

  const [selectEachProductOptions, setSelectEachProductOptions] = useState({});
  const [selectedEachProductOptions, setSelectedEachProductOptions] = useState();

  // 서버에 데이터 요청
  useEffect(() => {
    console.log(data);
    if (DUMMY.category != undefined) {
      setSelectCategoryOptioins(DUMMY.category);
    }
    setSelectEachProductOptions(generateEachProductDummyData(10));
  }, []);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // 카테고리 옵션 변경 handler
  const handleChangeSelectedCategoryOptions = (selectedOptions) => {
    setSelectedCategoryOptions(selectedOptions);
  };

  // 개별상품 옵션 변경 handler
  const handleChangeSelectedEachProductOptions = (selectedOptions) => {
    setSelectedEachProductOptions(selectedOptions);
  };

  // 개별 상품 옵션 제거 handler
  const handleDeleteSelectedEachProductOption = (removeProductCode) => {
    setSelectedEachProductOptions((prev) =>
      prev.filter((selectedOption) => selectedOption.product.code != removeProductCode),
    );
  };

  // 목록으로 이동
  const moveList = () => {
    navigate({
      pathname: `/customer/${customerId}/payment`,
    });
  };

  // 등록
  const handleSaveData = () => {
    alert('변경사항 적용');
  };

  return {
    HEADERS,
    data,
    selectCategoryOptions,
    selectedCategoryOptions,
    selectEachProductOptions,
    selectedEachProductOptions,
    handleChangeInputValue,
    handleChangeSelectedCategoryOptions,
    handleChangeSelectedEachProductOptions,
    handleDeleteSelectedEachProductOption,
    moveList,
    handleSaveData,
  };
};
