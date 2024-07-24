import MenuHeaderNav from '../../layout/MenuHeaderNav';
import OneButtonFooterLayout from '../../layout/OneButtonFooterLayout';
import useOrderListStore from './../../store/stores/useOrderListStore';

const OrderComponent = () => {
  const { orderList } = useOrderListStore();
  //목록 선택
  const listToShow = orderList;

  return (
    <>
      <MenuHeaderNav title={'주문 / 결제'} />
      <div className='flex flex-col items-center w-full'>
        <section className='w-[90%]'>
          <span className='block py-2 border-b font-bold'>주문 상품</span>
          {/* orderList start*/}
          <ul className='list-none p-0 m-0'>
            {listToShow.length === 0 ? (
              <li className='flex items-center justify-center py-4'>
                <span className='text-gray-600'>추가한 상품이 없습니다.</span>
              </li>
            ) : (
              listToShow.map((item, index) => (
                <li
                  key={index}
                  className='flex items-center border-b py-4'
                  style={{ height: 'calc((100vh - 10rem) / 5)' }}
                >
                  <div className='flex-1 flex justify-center items-center h-full'>
                    <div
                      className='h-full aspect-square rounded-lg bg-cover'
                      style={{ backgroundImage: `url('/image/nike2.png')` }}
                    ></div>
                  </div>
                  <div className='flex-2 px-2'>
                    <div className='flex flex-col justify-center h-full font-bold text-sm'>
                      <div>{item.name}</div>
                      <div className='flex items-center mt-4'>
                        <span className='text-gray-600 text-xs'>수량: {item.quantity} 팩</span>
                        <span className='mx-2 text-gray-600 text-xs'>|</span>
                        <span className='text-dark-orange text-xs'>{item.cost} 원</span>
                      </div>
                    </div>
                  </div>
                  <div className='flex-1'></div>
                </li>
              ))
            )}
          </ul>
          {/* orderList end */}
        </section>
      </div>
      <OneButtonFooterLayout footerText={'결제하기'} />
    </>
  );
};

export default OrderComponent;
