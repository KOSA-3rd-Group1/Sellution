import FooterComponent from '@/client/layout/partials/FooterComponent';
import DeliveryInfo from '@/client/layout/order/DeliveryInfo';
import OrdererInfo from '@/client/layout/order/OrdererInfo';
import PaymentMethod from '@/client/layout/order/PaymentMethod';
import AddressInfo from '@/client/layout/order/AddressInfo';
import PaymentInfo from '@/client/layout/order/PaymentInfo';
import ProductInfo from '@/client/layout/order/ProductInfo';
import { useMove } from '@/client/business/common/useMove';
import { useCustomerOrderDetail } from '@/client/business/customer/detail/order/useCustomerOrderDetail';
// import { HEADERS, ROW_HEIGHT } from '@/client/utility/tableinfo/OrderDetailTableInfo';

const DetailComponent = () => {
  const { moveToPathname } = useMove();
  const {
    serviceType,
    orderProductData,
    deliveryInfoData,
    paymentInfoData,
    addressInfo,
    ordererInfo,
    paymentMethod,
    data,
    moveList,
  } = useCustomerOrderDetail({ moveToPathname });

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto gap-10'>
        <div className='w-3/5'>
          <div className='w-full h-20 text-lg font-semibold flex items-center'>
            <div>주문 상세 조회</div>
          </div>
          <div className='w-full flex flex-wrap items-center text-base text-gray-800'>
            <div className='min-w-fit flex items-center gap-4 pr-10'>
              <div className='min-w-fit'>주문번호</div>
              <div className='min-w-fit text-brandOrange'>{data.orderCode}</div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='min-w-fit'>주문시간</div>
              <div className='min-w-fit text-brandOrange'>{data.orderCreatedAt}</div>
            </div>
          </div>
        </div>
        <div className='flex-1 w-5/6'>
          <ProductInfo data={orderProductData} />
        </div>

        {serviceType !== null && serviceType !== 'ONETIME' && (
          <div className='flex-1 w-5/6'>
            <DeliveryInfo data={deliveryInfoData} />
          </div>
        )}
        <div className='flex-1 w-5/6'>
          <PaymentInfo data={data} />
        </div>
        <div className='flex-1 w-5/6'>
          <AddressInfo data={addressInfo} />
        </div>
        <div className='flex-1 w-5/6'>
          <OrdererInfo data={ordererInfo} />
        </div>
        <div className='flex-1 w-5/6'>
          <PaymentMethod data={paymentMethod} />
        </div>
      </section>
      <FooterComponent back={{ label: '목록으로', event: moveList }} />
    </div>
  );
};

export default DetailComponent;
