import FooterComponent from '@/client/layout/partials/FooterComponent';
import TableOrder from '@/client/layout/common/TableOrder';
import { EventBtn } from '@/client/layout/common/Button';
import { useCustomerOrderList } from '@/client/business/customer/detail/order/useCustomerOrderList';
import { useCustomerOnetimeOrderList } from '@/client/business/customer/detail/order/useCustomerOnetimeOrderList';
import { SimpleOrderIcon } from '@/client/utility/assets/Icons';

const ListComponent = () => {
  const {
    HEADERS: SUBSCRIPTION_HEADERS,
    ROW_HEIGHT: SUBSCRIPTION_ROW_HEIGHT,
    data: SUBSCRIPTION_data,
    totalDataCount: SUBSCRIPTION_totalDataCount,
    handleApproveAllSimpleOrderBtn: SUBSCRIPTION_handleApproveAllSimpleOrderBtn,
    handleApproveSimpleOrderBtn: SUBSCRIPTION_handleApproveSimpleOrderBtn,
    handleRowEvent: SUBSCRIPTION_handleRowEvent,
    moveList,
  } = useCustomerOrderList();

  const {
    HEADERS: ONETIME_HEADERS,
    ROW_HEIGHT: ONETIME_ROW_HEIGHT,
    data: ONETIME_data,
    totalDataCount: ONETIME_totalDataCount,
    handleApproveAllSimpleOrderBtn: ONETIME_handleApproveAllSimpleOrderBtn,
    handleApproveSimpleOrderBtn: ONETIME_handleApproveSimpleOrderBtn,
    handleRowEvent: ONETIME_handleRowEvent,
  } = useCustomerOnetimeOrderList();

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto '>
        <div className='w-full min-h-14 h-14 max-h-14 text-lg font-semibold flex items-center'>
          <div>정기 배송 주문 정보</div>
        </div>
        <div className='h-3/5 overflow-hidden'>
          <TableOrder
            HEADERS={SUBSCRIPTION_HEADERS}
            ROW_HEIGHT={SUBSCRIPTION_ROW_HEIGHT}
            data={SUBSCRIPTION_data}
            totalDataCount={SUBSCRIPTION_totalDataCount}
            handleApproveSimpleOrderBtn={SUBSCRIPTION_handleApproveAllSimpleOrderBtn}
            handleRowEvent={SUBSCRIPTION_handleRowEvent}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn
                  Icon={SimpleOrderIcon}
                  label={'간편 주문 승인'}
                  onClick={SUBSCRIPTION_handleApproveSimpleOrderBtn}
                />
              </div>
            }
          />
        </div>
        <div className='h-10'></div>
        <div className='w-full  min-h-14 h-14 max-h-14 text-lg font-semibold flex items-center'>
          <div>단건 배송 주문 정보</div>
        </div>
        <div className='h-3/5 overflow-hidden'>
          <TableOrder
            HEADERS={ONETIME_HEADERS}
            ROW_HEIGHT={ONETIME_ROW_HEIGHT}
            data={ONETIME_data}
            totalDataCount={ONETIME_totalDataCount}
            handleApproveSimpleOrderBtn={ONETIME_handleApproveAllSimpleOrderBtn}
            handleRowEvent={ONETIME_handleRowEvent}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn
                  Icon={SimpleOrderIcon}
                  label={'간편 주문 승인'}
                  onClick={ONETIME_handleApproveSimpleOrderBtn}
                />
              </div>
            }
          />
        </div>
      </section>
      <FooterComponent back={{ label: '목록으로', event: moveList }} />
    </div>
  );
};

export default ListComponent;
