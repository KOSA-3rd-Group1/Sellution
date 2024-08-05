import FooterComponent from '@/client/layout/partials/FooterComponent';
import DeliveryInfo from '@/client/layout/order/DeliveryInfo';
import OrdererInfo from '@/client/layout/order/OrdererInfo';
import PaymentMethod from '@/client/layout/order/PaymentMethod';
import AddressInfo from '@/client/layout/order/AddressInfo';
import PaymentInfo from '@/client/layout/order/PaymentInfo';
import ProductInfo from '@/client/layout/order/ProductInfo';
import { useMove } from '@/client/business/common/useMove';
import { useOrderDetail } from '@/client/business/order/useOrderDetail';

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
  } = useOrderDetail({
    moveToPathname,
  });

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto gap-10'>
        <div className='w-full'>
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
        <div className='flex-1 w-full'>
          <ProductInfo data={orderProductData} />
        </div>

        {serviceType !== null && serviceType !== 'ONETIME' && (
          <div className='flex-1 w-full'>
            <DeliveryInfo data={deliveryInfoData} />
          </div>
        )}
        <div className='flex-1 w-full'>
          <PaymentInfo data={data} />
        </div>
        <div className='flex-1 w-full'>
          <AddressInfo data={addressInfo} />
        </div>
        <div className='flex-1 w-full'>
          <OrdererInfo data={ordererInfo} />
        </div>
        <div className='flex-1 w-full'>
          <PaymentMethod data={paymentMethod} />
        </div>
      </section>
      <FooterComponent back={{ label: '목록으로', event: moveList }} />
    </div>
  );
};

export default DetailComponent;
