import FooterComponent from '@/client/layout/partials/FooterComponent';
import TableCustomerOrder from '@/client/layout/common/table/TableCustomerOrder';
import { EventBtn } from '@/client/layout/common/Button';
import { useMove } from '@/client/business/common/useMove';
import { useCustomerOrderList } from '@/client/business/customer/detail/order/useCustomerOrderList';
// import { useCustomerOnetimeOrderList } from '@/client/business/customer/detail/order/useCustomerOnetimeOrderList';
import { SimpleOrderIcon } from '@/client/utility/assets/Icons';
import {
  SUBSCRIPTION_HEADERS,
  SUBSCRIPTION_ROW_HEIGHT,
  ONETIME_HEADERS,
  ONETIME_ROW_HEIGHT,
} from '@/client/utility/tableinfo/CustomerOrderListTableInfo';

const ListComponent = () => {
  const { moveToPathname } = useMove();
  const {
    subscriptionData,
    subscriptionTotalDataCount,
    onetimeData,
    onetimeTotalDataCount,
    handleApproveAllSimpleOrderBtn,
    handleApproveSimpleOrderBtn,
  } = useCustomerOrderList();

  //   const {
  //     data: SUBSCRIPTION_data,
  //     totalDataCount: SUBSCRIPTION_totalDataCount,
  //     handleApproveAllSimpleOrderBtn: SUBSCRIPTION_handleApproveAllSimpleOrderBtn,
  //     handleApproveSimpleOrderBtn: SUBSCRIPTION_handleApproveSimpleOrderBtn,
  //   } = useCustomerOrderList();

  //   const {
  //     data: ONETIME_data,
  //     totalDataCount: ONETIME_totalDataCount,
  //     handleApproveAllSimpleOrderBtn: ONETIME_handleApproveAllSimpleOrderBtn,
  //     handleApproveSimpleOrderBtn: ONETIME_handleApproveSimpleOrderBtn,
  //   } = useCustomerOnetimeOrderList();

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] py-2 px-4 flex flex-col overflow-y-auto '>
        <div className='w-full min-h-16 h-16 max-h-16 text-lg font-semibold flex items-center'>
          <div>정기 배송 주문 정보</div>
        </div>
        <div className='h-3/5 overflow-hidden'>
          <TableCustomerOrder
            HEADERS={SUBSCRIPTION_HEADERS}
            ROW_HEIGHT={SUBSCRIPTION_ROW_HEIGHT}
            data={subscriptionData}
            totalDataCount={subscriptionTotalDataCount}
            handleApproveSimpleOrderBtn={handleApproveSimpleOrderBtn}
            handleRowEvent={moveToPathname}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn
                  Icon={SimpleOrderIcon}
                  label={'간편 주문 승인'}
                  onClick={() => handleApproveAllSimpleOrderBtn('subscription')}
                />
              </div>
            }
            tableId={'subscription'}
          />
        </div>
        <div className='h-6'></div>
        <div className='w-full  min-h-16 h-16 max-h-16 text-lg font-semibold flex items-center'>
          <div>단건 배송 주문 정보</div>
        </div>
        <div className='h-3/5 overflow-hidden'>
          <TableCustomerOrder
            HEADERS={ONETIME_HEADERS}
            ROW_HEIGHT={ONETIME_ROW_HEIGHT}
            data={onetimeData}
            totalDataCount={onetimeTotalDataCount}
            handleApproveSimpleOrderBtn={handleApproveSimpleOrderBtn}
            handleRowEvent={moveToPathname}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn
                  Icon={SimpleOrderIcon}
                  label={'간편 주문 승인'}
                  onClick={() => handleApproveAllSimpleOrderBtn('onetime')}
                />
              </div>
            }
            tableId={'onetime'}
          />
        </div>
      </section>
      <FooterComponent back={{ label: '목록으로', event: () => moveToPathname('/customer') }} />
    </div>
  );
};

export default ListComponent;
