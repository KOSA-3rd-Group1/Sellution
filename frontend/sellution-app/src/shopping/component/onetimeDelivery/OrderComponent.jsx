import MenuHeaderNav from '../../layout/MenuHeaderNav';
import OneButtonFooterLayout from '../../layout/OneButtonFooterLayout';
import OrderListLayout from '../../layout/OrderListLayout';
import useOrderListStore from './../../store/stores/useOrderListStore';

const OrderComponent = () => {
  const { orderList } = useOrderListStore();
  //목록 선택
  const listToShow = orderList;

  return (
    <>
      <MenuHeaderNav title={'주문 / 결제'} />
      <div className='flex flex-col items-center w-full'>
        <OrderListLayout listToShow={listToShow} />
        {/* 배송지 */}
        {/*  */}
        {/*  */}
      </div>
      <OneButtonFooterLayout footerText={'결제하기'} />
    </>
  );
};

export default OrderComponent;
