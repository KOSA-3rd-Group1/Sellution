import FooterComponent from '@/client/layout/partials/FooterComponent';
import TableCustomerOrder from '@/client/layout/common/table/TableCustomerOrder';
import { EventBtn } from '@/client/layout/common/Button';
import { useMove } from '@/client/business/common/useMove';
import { useCustomerOrderList } from '@/client/business/customer/detail/order/useCustomerOrderList';
import { SimpleOrderIcon, OrderCancelAllIcon } from '@/client/utility/assets/Icons';
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
    handleApproveOneSimpleOrderBtn,
    handleApproveCancleAll,
  } = useCustomerOrderList();

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
            handleApproveSimpleOrderBtn={handleApproveOneSimpleOrderBtn}
            handleRowEvent={moveToPathname}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn
                  Icon={SimpleOrderIcon}
                  label={'간편 주문 승인'}
                  onClick={() => handleApproveAllSimpleOrderBtn('subscription')}
                />
                <EventBtn
                  Icon={OrderCancelAllIcon}
                  label={'주문 취소'}
                  onClick={() => handleApproveCancleAll('subscription')}
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
            handleApproveSimpleOrderBtn={handleApproveOneSimpleOrderBtn}
            handleRowEvent={moveToPathname}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn
                  Icon={SimpleOrderIcon}
                  label={'간편 주문 승인'}
                  onClick={() => handleApproveAllSimpleOrderBtn('onetime')}
                />
                <EventBtn
                  Icon={OrderCancelAllIcon}
                  label={'주문 취소'}
                  onClick={() => handleApproveCancleAll('onetime')}
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
