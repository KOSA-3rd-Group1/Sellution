import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useDetailOption = () => {
  const location = useLocation();
  const toggleDetailOption = () => {
    setDetailOptionVisible(!isDetailOptionVisible);
    //setDetailBlurred(!isDetailBlurred);
  };
  const [itemCountToAdd, setItemCountToAdd] = useState(0);
  const [productToShow, setProductToShow] = useState(null);
  const [isDetailOptionVisible, setDetailOptionVisible] = useState(false);

  const increaseQuantity = () => {
    setItemCountToAdd((prevQuantity) => prevQuantity + 1);
  };
  const decreaseQuantity = () => {
    setItemCountToAdd((prevQuantity) => Math.max(prevQuantity - 1, 0));
  };

  //detailOption 표시 상태 or 페이지 경로가 바뀔 때 수량을 초기화
  //두번쨰 인자가 뱐걍될 대마다 useEffect가 실행된다.
  useEffect(() => {
    if (!isDetailOptionVisible || location.pathname !== `/detail/${productToShow.id}`) {
      setItemCountToAdd(0); //수량을 0으로 초기화
    }
  }, [isDetailOptionVisible, location.pathname]);
  return {
    isDetailOptionVisible,
    toggleDetailOption,
    productToShow,
    itemCountToAdd,
    setItemCountToAdd,
    increaseQuantity,
    decreaseQuantity,
  };
};
export default useDetailOption;
