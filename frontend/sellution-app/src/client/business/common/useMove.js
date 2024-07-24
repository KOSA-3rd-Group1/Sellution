import { useState } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';

const getNum = (param, defaultValue) => {
  if (!param) return defaultValue;
  return parseInt(param);
};

export const useMove = () => {
  const navigate = useNavigate();

  const [refresh, setRefresh] = useState(false); //추가

  const [queryParams] = useSearchParams();

  const page = getNum(queryParams.get('page'), 1);
  const size = getNum(queryParams.get('size'), 10);

  const queryDefault = createSearchParams({ page, size }).toString(); //새로 추가

  const moveToList = (pageParam) => {
    let queryStr = '';
    if (pageParam) {
      const pageNum = getNum(pageParam.page, 1);
      const sizeNum = getNum(pageParam.size, 10);

      queryStr = createSearchParams({ page: pageNum, size: sizeNum }).toString();
    } else {
      queryStr = queryDefault;
    }

    setRefresh(!refresh);

    navigate({
      pathname: '..',
      search: queryStr,
    });
  };

  const moveToDetail = (num) => {
    console.log(queryDefault);
    navigate({
      pathname: `${num}`,
      search: queryDefault, //수정시에 기존의 쿼리 스트링 유지를 위해
    });
  };

  const moveToDetailForCustomer = (num) => {
    console.log(queryDefault);
    navigate({
      pathname: `${num}/default`,
      search: queryDefault, //수정시에 기존의 쿼리 스트링 유지를 위해
    });
  };

  const moveToAdd = () => {
    console.log(queryDefault);
    navigate({
      pathname: `add`,
      search: queryDefault,
    });
  };

  // 페이지네이션 버튼 이동
  const moveToPagination = (page) => {
    const searchParams = new URLSearchParams(location.search); // 현재의 쿼리 파라미터 가져오기
    searchParams.set('page', page); // page 파라미터를 새로운 값으로 설정
    const newSearch = searchParams.toString(); // 새로운 쿼리 스트링 생성
    navigate({
      pathname: '.',
      search: newSearch,
    });
  };

  return {
    moveToList,
    moveToDetail,
    moveToDetailForCustomer,
    moveToAdd,
    moveToPagination,
    page,
    size,
    refresh,
  };
};
