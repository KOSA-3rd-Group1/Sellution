import useList from '../../business/subscriptionDelivery/useList';
import OneButtonFooterLayout from '../../layout/OneButtonFooterLayout';
import MenuCategoryHeaderNav from '../../layout/MenuCategoryHeaderNav';
import useClientName from '../../business/layout/useClientName';
import { Link, useNavigate } from 'react-router-dom';

const ListComponent = () => {
  const navigate = useNavigate();
  const { subscriptionProductList, isLoading, subscriptionCategoryList, fetchProducts } = useList();
  const { clientName } = useClientName();
  const moveToSubscriptionCartPage = () => {
    navigate(`/shopping/${clientName}/subscription/cart`);
  };
  //정기배송 상품 더미데이터
  return (
    <>
      <MenuCategoryHeaderNav
        title={'정기배송 상품 목록'}
        categoryList={subscriptionCategoryList}
        onCategoryClick={fetchProducts}
      />
      <main className={`main-box w-full`}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className='product-list w-[90%] mx-auto bg-white list-none p-0'>
            {subscriptionProductList.map((product) => (
              <Link
                to={`/shopping/${clientName}/subscription/${product.productId}`}
                key={product.id}
              >
                <li
                  key={product.id}
                  className='product-item flex py-4 border-b border-gray-200 '
                  style={{ height: 'calc((100vh - 7.5rem) / 5)' }}
                >
                  <div className='product-item-1 flex-[3] flex justify-center items-center'>
                    <div
                      className='product-image w-full max-w-xs h-auto aspect-square rounded-lg bg-cover'
                      style={{ backgroundImage: `url('/image/product_img.png')` }}
                    ></div>
                  </div>
                  <div className='product-item-2 flex-[7] flex flex-col justify-center px-4'>
                    <div className='product-name font-bold text-sm my-1 flex-[1] flex items-end'>
                      {product.name}
                    </div>
                    <div className='product-price text-orange-500 my-1 flex-[1] flex items-start'>
                      {product.cost}원
                    </div>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </main>
      <OneButtonFooterLayout footerText={'장바구니로 이동'} onClick={moveToSubscriptionCartPage} />
    </>
  );
};

export default ListComponent;
