import useList from '../../business/onetimeDelivery/useList';
import OneButtonFooterLayout from '../../layout/OneButtonFooterLayout';
import MenuCategoryHeaderNav from '../../layout/MenuCategoryHeaderNav';
import { Link, useNavigate } from 'react-router-dom';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import LoadingSpinner from '../../layout/LoadingSpinner';
import { useRef, useCallback, useEffect, useState } from 'react';
import { formatPrice } from '../../../client/utility/functions/formatterFunction';

const ListComponent = () => {
  const navigate = useNavigate();
  const {
    onetimeProductList,
    isLoading,
    onetimeCategoryList,
    fetchProducts,
    loadMore,
    hasMore,
    setSelectedCategory,
    selectedCategory,
  } = useList();
  const clientName = useCompanyInfoStore((state) => state.name);
  const observer = useRef(); //intersectionObserver을 사용하기 위한 참조
  const scrollContainerRef = useRef(null); //스크롤 컨테이너를 참조하기 위한 변수
  const [scrollPosition, setScrollPosition] = useState(0);

  const moveToOnetimeCartPage = () => {
    navigate(`/shopping/${clientName}/onetime/cart`);
  };

  const [isCategoryMenuVisible, setIsCategoryMenuVisible] = useState(false);

  const handleCategoryClick = (categoryId) => {
    setScrollPosition(0); // 새로운 카테고리를 클릭할 때 스크롤 위치를 초기화합니다.
    const selected = onetimeCategoryList.find((category) => category.categoryId === categoryId) || {
      name: '단건배송 상품 목록',
    };
    setSelectedCategory(selected);
    setIsCategoryMenuVisible(false);
    fetchProducts(categoryId, true); // 페이지를 리셋하고 제품을 가져옵니다.
  };

  const lastProductElementRef = useCallback(
    //마지막 제품 요소를 관찰하여 무한 스크롤 구현
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect(); //더이상 관찰할 필요가 없을 때 옵저버 해제
      observer.current = new IntersectionObserver((entries) => {
        //마지막 제품이 보일 때(교차 상태가 변경될 때) 추가 제품을 로드(loadMore() 호출)하는 콜백함수
        if (entries[0].isIntersecting && hasMore) {
          //요소가 뷰포트에 들어오고 데이터가 더 있는 경우

          setScrollPosition(scrollContainerRef.current.scrollTop); // 스크롤 위치 저장
          // console.log('현재 스크롤 위치:', scrollContainerRef.current.scrollTop);
          loadMore();
        }
      });
      if (node) observer.current.observe(node); //특정 요소를 관찰 대상으로 지정
    },
    [isLoading, hasMore, loadMore], //옵저버의 동작을 설명하는 옵션 객체
  );

  useEffect(() => {
    //로딩이 끝나면 저장된 스크롤 위치로 스크롤을 이동시킴
    if (!isLoading && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, scrollPosition);
    }
  }, [isLoading, scrollPosition]);

  const renderProductContent = (product) => (
    <>
      <div className='product-item-1 flex-[3] flex justify-center items-center'>
        <div
          className='product-image w-full max-w-xs h-auto aspect-square rounded-lg bg-cover'
          style={{ backgroundImage: `url(${product.thumbnailImage})` }}
        ></div>
      </div>
      <div className='product-item-2 flex-[7] flex flex-col justify-center px-4 relative'>
        <div className='product-name font-bold text-[13px] flex-[3] flex items-end'>
          {product.name}
        </div>
        {product.isDiscount === 'Y' ? (
          <>
            <div className='text-[14px] text-gray-400 flex-[2] flex items-center gap-2'>
              <span className='text-red-400 font-bold'>{product.discountRate}%</span>
              <span className='line-through'>{formatPrice(product.cost)}</span>
            </div>
            <div className='product-price text-black flex-[3] flex items-start font-bold text-[14px]'>
              {formatPrice(product.discountedPrice)}
            </div>
          </>
        ) : (
          <>
            <div className='text-[14px] text-gray-400 flex-[2] flex items-center gap-2'>
              <span className='text-red-400 font-bold'></span>
              <span className='line-through'></span>
            </div>
            <div className='product-price text-black flex-[3] flex items-start font-bold text-[14px]'>
              {formatPrice(product.cost)}
            </div>
          </>
        )}
      </div>
    </>
  );

  return (
    <>
      <MenuCategoryHeaderNav
        title={'단건배송 상품 목록'}
        categoryList={onetimeCategoryList}
        onCategoryClick={handleCategoryClick}
        selectedCategory={selectedCategory}
        isCategoryMenuVisible={isCategoryMenuVisible}
        setIsCategoryMenuVisible={setIsCategoryMenuVisible}
      />

      {isLoading ? (
        <>{/* <LoadingSpinner /> */}</>
      ) : onetimeProductList.length === 0 ? (
        <main className={`main-box w-full`}>
          <p>등록된 상품이 없습니다</p>
        </main>
      ) : (
        <main
          className={`main-box w-full h-[100%]`}
          ref={scrollContainerRef}
          style={{ overflowY: 'auto' }}
        >
          <ul className='product-list w-[90%] mx-auto bg-white list-none p-0'>
            {onetimeProductList.map((product, index) => {
              const productElement = (
                <li
                  key={product.id}
                  className='product-item flex py-4 border-b border-gray-200 '
                  style={{ height: 'calc((100vh - 7.5rem) / 5)' }}
                >
                  {renderProductContent(product)}
                </li>
              );

              return onetimeProductList.length === index + 1 ? (
                <Link
                  to={`/shopping/${clientName}/onetime/${product.productId}`}
                  key={product.id}
                  ref={lastProductElementRef}
                >
                  {productElement}
                </Link>
              ) : (
                <Link to={`/shopping/${clientName}/onetime/${product.productId}`} key={product.id}>
                  {productElement}
                </Link>
              );
            })}
          </ul>
        </main>
      )}
      <OneButtonFooterLayout footerText={'장바구니로 이동'} onClick={moveToOnetimeCartPage} />
    </>
  );
};

export default ListComponent;
