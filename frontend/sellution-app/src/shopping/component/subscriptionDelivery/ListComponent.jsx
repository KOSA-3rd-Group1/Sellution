import useList from '../../business/subscriptionDelivery/useList';
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
    subscriptionProductList,
    isLoading,
    subscriptionCategoryList,
    fetchProducts,
    loadMore,
    hasMore,
    setSelectedCategory,
    selectedCategory,
  } = useList();
  const clientName = useCompanyInfoStore((state) => state.name);
  const observer = useRef();
  const scrollContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const moveToSubscriptionCartPage = () => {
    navigate(`/shopping/${clientName}/subscription/cart`);
  };

  const [isCategoryMenuVisible, setIsCategoryMenuVisible] = useState(false);

  const handleCategoryClick = (categoryId) => {
    const selected = subscriptionCategoryList.find(
      (category) => category.categoryId === categoryId,
    ) || {
      name: '정기배송 상품 목록',
    };
    setSelectedCategory(selected);
    setIsCategoryMenuVisible(false);
    fetchProducts(categoryId, true); // 페이지를 리셋하고 제품을 가져옵니다.
  };

  const lastProductElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setScrollPosition(scrollContainerRef.current.scrollTop); //스크롤 위 치 저장
          console.log('현재 스크롤 위치: ', scrollContainerRef.current.scrollTop);
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMore],
  );

  // useEffect(() => {
  //   fetchProducts(null, true); // 페이지를 리셋하고 제품을 가져옵니다.
  // }, []);
  useEffect(() => {
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
        {/* {product.stock === 0 && (
          <span className='font-bold absolute bottom-0 right-0 text-white bg-gray-300 px-2 py-1 text-[10px]'>
            SOLD OUT
          </span>
        )} */}
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
        title={'정기배송 상품 목록'}
        categoryList={subscriptionCategoryList}
        onCategoryClick={handleCategoryClick}
        selectedCategory={selectedCategory}
        isCategoryMenuVisible={isCategoryMenuVisible}
        setIsCategoryMenuVisible={setIsCategoryMenuVisible}
      />
      {isLoading ? (
        <>{/* <LoadingSpinner /> */}</>
      ) : subscriptionProductList.length === 0 ? (
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
            {subscriptionProductList.map((product, index) => {
              const productElement = (
                <li
                  key={product.id}
                  className='product-item flex py-4 border-b border-gray-200 '
                  style={{ height: 'calc((100vh - 7.5rem) / 5)' }}
                >
                  {renderProductContent(product)}
                </li>
              );

              return subscriptionProductList.length === index + 1 ? (
                <Link
                  to={`/shopping/${clientName}/subscription/${product.productId}`}
                  key={product.id}
                  ref={lastProductElementRef}
                >
                  {productElement}
                </Link>
              ) : (
                <Link
                  to={`/shopping/${clientName}/subscription/${product.productId}`}
                  key={product.id}
                >
                  {productElement}
                </Link>
              );
            })}
          </ul>
        </main>
      )}
      <OneButtonFooterLayout footerText={'장바구니로 이동'} onClick={moveToSubscriptionCartPage} />
    </>
  );
};

export default ListComponent;
