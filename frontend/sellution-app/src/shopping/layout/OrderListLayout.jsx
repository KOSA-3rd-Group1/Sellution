import { formatPrice } from './../../client/utility/functions/formatterFunction';
const OrderListLayout = ({ listToShow }) => {
  return (
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
              <div className='flex-1 flex justify-start items-center h-full'>
                <div
                  className='h-full aspect-square rounded-lg bg-cover'
                  style={{ backgroundImage: `url(${item.thumbnailImage})` }}
                ></div>
              </div>
              <div className='flex-[2.5] flex justify-start px-2'>
                <div className='flex flex-col justify-center h-full font-bold text-sm w-full'>
                  <div>{item.name}</div>
                  <div className='text-[14px] text-gray-400 flex-[2] flex items-center justify-between gap-1 mt-2'>
                    <div>
                      <div className='flex gap-2'>
                        <span className='text-red-400 text-xs'>{item.discountRate}%</span>
                        <span className='text-gray-400 line-through text-xs'>
                          {formatPrice(item.cost)}
                        </span>
                      </div>
                      <div className='mt-1'>
                        <span className='text-black text-sm'>
                          {formatPrice(item.discountedPrice)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className='text-gray-600 text-xs'>수량: {item.quantity} 개</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className='flex-1'></div> */}
            </li>
          ))
        )}
      </ul>
      {/* orderList end */}
    </section>
  );
};
export default OrderListLayout;
