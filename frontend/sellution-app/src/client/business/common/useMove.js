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

  // 일반 경로 이동
  const moveDefault = (pathname) => {
    navigate({
      pathname: pathname,
    });
  };

  // 일반 경로 이동 시 데이터 전달
  const moveDefaultSendState = (pathname, state) => {
    navigate(pathname, {
      state: state,
    });
  };

  // 일반 경로 이동 시 param으로 이동
  const moveDefaultSearch = (pathname, pageParam) => {
    const queryParams = createSearchParams({ ...pageParam });
    const newQueryParams = queryParams.toString(); // 새로운 쿼리 스트링 생성

    navigate({ pathname, search: newQueryParams });
  };

  // queryParams를 유지하면서 pathname으로 경로 이동
  const moveToPathname = (pathname) => {
    setRefresh(!refresh);
    navigate({
      pathname,
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

  // 기본 목록으로 이동
  const moveToDefaultPath = (pathname) => {
    const search = createSearchParams({
      page: 1,
      size: 10,
    }).toString();
    // setRefresh(!refresh);
    navigate({
      pathname,
      search,
    });
  };

  return {
    queryParams,
    page,
    size,
    refresh,
    moveToPathname,
    moveToPagination,
    updateQueryParameter,
    moveToDefaultPath,
    moveDefault,
    moveDefaultSendState,
    moveDefaultSearch,
  };
};
