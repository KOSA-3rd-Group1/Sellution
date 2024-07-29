import { Link, useNavigate } from 'react-router-dom';
import useOnetimeCartStore from './../../store/stores/useOnetimeCartStore';
import MenuHeaderNav from '../../layout/MenuHeaderNav';
import OneButtonFooterLayout from '../../layout/OneButtonFooterLayout';
import useOrderListStore from './../../store/stores/useOrderListStore';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import useUserInfoStore from '@/shopping/store/stores/useUserInfoStore';
import { DeleteIcon, MinusIcon, PlusIcon } from '../../utility/assets/Icons';

const CartComponent = () => {
  const {
    onetimeCart,
    selectedOnetimeItems, // index는 productId를 사용함
    selectAllOnetimeItems,
    removeSelectedOnetimeItems,
    toggleSelectedOnetimeItems,
    increaseOnetimeCartQuantity,
    decreaseOnetimeCartQuantity,
    removeFromOnetimeCart,
  } = useOnetimeCartStore();
  const { updateOrderList } = useOrderListStore();

  const navigate = useNavigate();
  const clientName = useCompanyInfoStore((state) => state.name);
  const customerId = useUserInfoStore((state) => state.id);
  const allSelected = onetimeCart.length > 0 && selectedOnetimeItems.length === onetimeCart.length;

  const addToOrderList = () => {
    updateOrderList(selectedOnetimeItems, onetimeCart);
    navigate(`/shopping/${clientName}/onetime/order/${customerId}`);
  };
  const isOrderButtonDisabled = selectedOnetimeItems.length === 0;

  return (
    <>
      <MenuHeaderNav title={'장바구니'} />
      <div className='flex flex-col items-center w-full'>
        <section className='page-label flex justify-start items-center w-full pt-4'>
          <div
            className={`font-bold py-2 px-3 text-sm cursor-pointer 'text-gray-500'}`}
            onClick={() => {
              navigate(`/shopping/${clientName}/subscription/cart`);
            }}
          >
            정기 배송
          </div>
          <div
            className={`font-bold py-2 px-3 text-sm cursor-pointer bg-brandOrange text-white`}
            onClick={() => {
              navigate(`/shopping/${clientName}/onetime/cart`);
            }}
          >
            단건 배송
          </div>
        </section>
        <div className='seperator w-full h-[2px] bg-brandOrange'></div>
        <section className='w-[92%] h-full mx-auto mt-2 '>
          <div className='flex justify-between py-2 border-b'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                checked={allSelected}
                onChange={(e) => selectAllOnetimeItems(e.target.checked)}
                className='hidden-checkbox'
                id='selectAll'
              />
              <label htmlFor='selectAll' className='custom-checkbox'>
                <div className='custom-checkbox-box'></div>
                <span className='font-bold ml-2 text-sm'>
                  전체 선택 ({selectedOnetimeItems.length}/{onetimeCart.length})
                </span>
              </label>
            </div>
            {selectedOnetimeItems.length > 0 && (
              <button onClick={removeSelectedOnetimeItems} className='text-gray-400 text-sm'>
                선택 상품 삭제
              </button>
            )}
          </div>
          {/* 목록 시작*/}
          <ul className='product-list w-full bg-white list-none p-0'>
            {onetimeCart.length === 0 ? (
              <li className='flex items-center justify-center py-4'>
                <span className='text-gray-600'>추가한 상품이 없습니다.</span>
              </li>
            ) : (
              onetimeCart.map((item) => (
                <li
                  key={item.productId}
                  className='product-item py-4 border-gray-200 flex'
                  style={{ height: 'calc((100vh - 13.5rem) / 5)' }}
                >
                  <div className='flex items-start'>
                    <input
                      type='checkbox'
                      checked={selectedOnetimeItems.includes(item.productId)}
                      onChange={() => toggleSelectedOnetimeItems(item.productId)}
                      className='hidden-checkbox'
                      id={`checkbox-${item.productId}`}
                    />
                    <label htmlFor={`checkbox-${item.productId}`} className='custom-checkbox'>
                      <div className='custom-checkbox-box'></div>
                    </label>
                  </div>
                  <div className='product-item-1 flex-[3] flex justify-center items-center '>
                    <div
                      className='product-image h-full aspect-square rounded-lg bg-cover '
                      style={{ backgroundImage: `url(${item.thumbnailImage})` }}
                    >
                      <Link
                        to={`/shopping/${clientName}/onetime/${item.productId}`}
                        key={item.productId}
                      ></Link>
                    </div>
                  </div>
                  <div className='product-item-2 flex-[5] flex flex-col justify-center px-4'>
                    <div className='product-name font-bold text-sm'>{item.name}</div>
                    <div className='product-price text-brandOrange my-2'>{item.cost} 원</div>
                    <div className='quantity-control flex items-center border border-gray-300 w-20'>
                      <button
                        className='quantity-button w-6 h-6 bg-gray-300 flex justify-center items-center'
                        onClick={() => decreaseOnetimeCartQuantity(item.productId)}
                      >
                        <MinusIcon className={'minus w-4 h-4 stroke-current text-gray-600'} />
                      </button>
                      <div className='quantity flex-1 text-center'>{item.quantity}</div>
                      <button
                        className='quantity-button w-6 h-6 bg-gray-300 flex justify-center items-center'
                        onClick={() => increaseOnetimeCartQuantity(item.productId)}
                      >
                        <PlusIcon className={'plus w-4 h-4 stroke-current text-gray-600'} />
                      </button>
                    </div>
                  </div>
                  <div className='product-item-3 flex-[1] flex justify-end items-start'>
                    <button className='' onClick={() => removeFromOnetimeCart(item.productId)}>
                      <DeleteIcon className={'w-6 h-6'} />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
          {/* 목록 끝 */}
        </section>
      </div>
      <OneButtonFooterLayout
        onClick={addToOrderList}
        footerText={'구매하기'}
        isDisabled={isOrderButtonDisabled}
      />
    </>
  );
};

export default CartComponent;
