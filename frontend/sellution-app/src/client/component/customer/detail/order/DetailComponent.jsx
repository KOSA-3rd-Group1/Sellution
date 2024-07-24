import FooterComponent from '@/client/layout/partials/FooterComponent';
import { useCustomerOrderDetail } from '@/client/business/customer/detail/order/useCustomerOrderDetail';
import DeliveryInfo from '@/client/layout/order/DeliveryInfo';
import OrdererInfo from '@/client/layout/order/OrdererInfo';
import PaymentMethod from '@/client/layout/order/PaymentMethod';
import AddressInfo from '@/client/layout/order/AddressInfo';
import PaymentInfo from '@/client/layout/order/PaymentInfo';
import ProductInfo from '@/client/layout/order/ProductInfo';

const DetailComponent = () => {
  const { HEADERS, ROW_HEIGHT, orderProductData, data, moveList } = useCustomerOrderDetail();

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto gap-10'>
        <div className='w-3/5'>
          <div className='w-full h-20 text-lg font-semibold flex items-center'>
            <div>주문 상세 조회</div>
          </div>
          <div className='flex items-center gap-20 text-base text-gray-800'>
            <div className='flex items-center gap-4'>
              <div>주문번호</div>
              <div className='text-brandOrange'>2023050217261</div>
            </div>
            <div className='flex items-center gap-4'>
              <div>주문시간</div>
              <div>2023-05-02 00:00:00</div>
            </div>
          </div>
        </div>
        <div className='flex-1 w-5/6'>
          <ProductInfo HEADERS={HEADERS} ROW_HEIGHT={ROW_HEIGHT} data={orderProductData} />
        </div>
        <div className='flex-1 w-5/6'>
          <DeliveryInfo data={data} />
        </div>
        <div className='flex-1 w-5/6'>
          <PaymentInfo data={data} />
        </div>
        <div className='flex-1 w-5/6'>
          <AddressInfo data={data} />
        </div>
        <div className='flex-1 w-5/6'>
          <OrdererInfo data={data} />
        </div>
        <div className='flex-1 w-5/6'>
          <PaymentMethod data={data} />
        </div>
      </section>
      <FooterComponent back={{ label: '목록으로', event: moveList }} />
    </div>
  );
};

export default DetailComponent;
