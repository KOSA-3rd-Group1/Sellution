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

  queryParams.set('page', page);
  queryParams.set('size', size);

  const moveToPath = (pathname) => {
    const queryStr = queryParams.toString();
    setRefresh(!refresh);
    navigate({
      pathname: pathname,
      search: queryStr,
    });
  };

  const moveToDetail = (num) => {
    navigate({
      pathname: `${num}`,
      search: queryParams.toString(), //수정시에 기존의 쿼리 스트링 유지를 위해
    });
  };

  const moveToDetailForCustomer = (num) => {
    navigate({
      pathname: `${num}/default`,
      search: queryParams.toString(), //수정시에 기존의 쿼리 스트링 유지를 위해
    });
  };

  const moveToAdd = () => {
    navigate({
      pathname: `add`,
      search: queryParams.toString(),
    });
  };

  // 페이지네이션 버튼 이동
  const moveToPagination = (page) => {
    queryParams.set('page', page); // page 파라미터를 새로운 값으로 설정
    const queryStr = queryParams.toString(); // 새로운 쿼리 스트링 생성

    setRefresh(!refresh);
    navigate({
      pathname: '.',
      search: queryStr,
    });
  };

  // 쿼리 파라미터 업데이트
  const updateQueryParameter = (pageParam, page) => {
    const queryParams = createSearchParams({ ...pageParam });
    queryParams.set('page', page); // page 파라미터를 새로운 값으로 설정
    const newQueryParams = queryParams.toString(); // 새로운 쿼리 스트링 생성

    navigate({
      pathname: '.',
      search: newQueryParams,
    });
  };

  return {
    queryParams,
    page,
    size,
    refresh,
    moveToPath,
    moveToDetail,
    moveToDetailForCustomer,
    moveToAdd,
    moveToPagination,
    updateQueryParameter,
  };
};
