import { EventBtn, NotBorderBtn, CountOrderBtn, ResetBtn } from '@/client/layout/common/Button';
import TableOrder from '@/client/layout/common/table/TableOrder';
import Pagination from '@/client/layout/common/Pagination';
import DateRange from '@/client/layout/common/DateRange';
import ToggleButton from '@/client/layout/common/ToggleButton';
import AlertModal from '@/client/layout/common/modal/AlertModal';
import LoadingModal from '@/client/layout/common/modal/LodingModal';
import { useMove } from '@/client/business/common/useMove';
import { useModal } from '@/client/business/common/useModal';
import { useOrderList } from '@/client/business/order/useOrderList';
import {
  SimpleOrderIcon,
  OrderApproveAllIcon,
  OrderCancelAllIcon,
} from '@/client/utility/assets/Icons';
import { HEADERS, ROW_HEIGHT } from '@/client/utility/tableinfo/OrderListTableInfo';

const ListComponent = () => {
  const {
    queryParams,
    page,
    size,
    refresh,
    moveToPathname,
    moveToPagination,
    updateQueryParameter,
  } = useMove();
  const { alertModalState, openAlertModal, closeAlertModal } = useModal();
  const {
    data,
    holdCount,
    totalPages,
    totalDataCount,
    tableState,
    dateRangeValue,
    isAutoApproved,
    isLoading,
    setTableState,
    handleChangeDateRangeValue,
    handleFilterReset,
    handleToggleAutoOrderApproved,
    checkAppoveOrder,
    checkCancleOrder,
    handleOnConfirm,
  } = useOrderList({
    queryParams,
    page,
    size,
    refresh,
    updateQueryParameter,
    openAlertModal,
  });

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-full flex flex-col'>
        <div className='relative flex justify-between text-lg flex-none mt-2 pr-5 z-40'>
          <DateRange
            dateRangeValue={dateRangeValue}
            handleChangeDateRangeValue={handleChangeDateRangeValue}
          />
          <div className='flex items-center gap-1'>
            <NotBorderBtn Icon={SimpleOrderIcon} label={'자동 주문 승인'} />
            <ToggleButton isToggled={isAutoApproved} handleToggle={handleToggleAutoOrderApproved} />
          </div>
        </div>
        <div className='flex-grow overflow-hidden'>
          <TableOrder
            HEADERS={HEADERS}
            ROW_HEIGHT={ROW_HEIGHT}
            data={data}
            totalDataCount={totalDataCount}
            tableState={tableState}
            setTableState={setTableState}
            handleRowEvent={moveToPathname}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                 <CountOrderBtn label={'주문승인대기'} count={holdCount} />
                <EventBtn
                  Icon={OrderApproveAllIcon}
                  label={'간편주문승인'}
                  onClick={checkAppoveOrder}
                />
                <EventBtn Icon={OrderCancelAllIcon} label={'주문취소'} onClick={checkCancleOrder} />
              </div>
            }
            ResetBtn={<ResetBtn label={'초기화'} onClick={() => handleFilterReset('orderlist')} />}
            tableId={'orderlist'}
          />
        </div>
        <div className='h-12 flex-none flex justify-end items-end '>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            moveToPagination={moveToPagination}
          />
        </div>

        <AlertModal
          isOpen={alertModalState.isOpen}
          onClose={closeAlertModal}
          onConfirm={handleOnConfirm}
          type={alertModalState.type}
          title={alertModalState.title}
          message={alertModalState.message}
        />

        <LoadingModal isOpen={isLoading} />
      </section>
    </div>
  );
};

export default ListComponent;
