import FooterComponent from '@/client/layout/partials/FooterComponent';
import TableCustomerOrder from '@/client/layout/common/table/TableCustomerOrder';
import { EventBtn } from '@/client/layout/common/Button';
import AlertModal from '@/client/layout/common/modal/AlertModal';
import LoadingModal from '@/client/layout/common/modal/LodingModal';
import { useMove } from '@/client/business/common/useMove';
import { useModal } from '@/client/business/common/useModal';
import { useCustomerOrderList } from '@/client/business/customer/detail/order/useCustomerOrderList';
import {
  SimpleOrderIcon,
  OrderApproveAllIcon,
  OrderCancelAllIcon,
} from '@/client/utility/assets/Icons';
import {
  SUBSCRIPTION_HEADERS,
  SUBSCRIPTION_ROW_HEIGHT,
  ONETIME_HEADERS,
  ONETIME_ROW_HEIGHT,
} from '@/client/utility/tableinfo/CustomerOrderListTableInfo';

const ListComponent = () => {
  const { moveToPathname } = useMove();
  const { alertModalState, openAlertModal, closeAlertModal } = useModal();
  const {
    subscriptionData,
    subscriptionTotalDataCount,
    onetimeData,
    onetimeTotalDataCount,
    isLoading,
    checkAppoveOrderAll,
    checkAppoveOrderOne,
    checkCancleOrder,
    handleOnConfirm,
  } = useCustomerOrderList({ openAlertModal });

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
            handleApproveSimpleOrderBtn={checkAppoveOrderOne}
            handleRowEvent={moveToPathname}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn
                  Icon={OrderApproveAllIcon}
                  label={'간편 주문 승인'}
                  onClick={() => checkAppoveOrderAll('subscription')}
                />
                <EventBtn
                  Icon={OrderCancelAllIcon}
                  label={'주문 취소'}
                  onClick={() => checkCancleOrder('subscription')}
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
            handleApproveSimpleOrderBtn={checkAppoveOrderOne}
            handleRowEvent={moveToPathname}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn
                  Icon={OrderApproveAllIcon}
                  label={'간편 주문 승인'}
                  onClick={() => checkAppoveOrderAll('onetime')}
                />
                <EventBtn
                  Icon={OrderCancelAllIcon}
                  label={'주문 취소'}
                  onClick={() => checkCancleOrder('onetime')}
                />
              </div>
            }
            tableId={'onetime'}
          />
        </div>
      </section>
      <FooterComponent back={{ label: '목록으로', event: () => moveToPathname('/customer') }} />

      <AlertModal
        isOpen={alertModalState.isOpen}
        onClose={closeAlertModal}
        onConfirm={handleOnConfirm}
        type={alertModalState.type}
        title={alertModalState.title}
        message={alertModalState.message}
      />

      <LoadingModal isOpen={isLoading} />
    </div>
  );
};

export default ListComponent;
