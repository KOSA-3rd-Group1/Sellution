import { EventBtn, NotBorderBtn, CountOrderBtn, ResetBtn } from '@/client/layout/common/Button';
import TableOrder from '@/client/layout/common/table/TableOrder';
import Pagination from '@/client/layout/common/Pagination';
import DateRange from '@/client/layout/common/DateRange';
import ToggleButton from '@/client/layout/common/ToggleButton';
import { useMove } from '@/client/business/common/useMove';
import { useOrderList } from '@/client/business/order/useOrderList';
import { SimpleOrderIcon } from '@/client/utility/assets/Icons';
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
  const {
    data,
    totalPages,
    totalDataCount,
    tableState,
    dateRangeValue,
    isAutoApproved,
    setTableState,
    handleChangeDateRangeValue,
    handleFilterReset,
    handleToggleAutoOrderApproved,
    handleApproveAllSimpleOrderBtn,
  } = useOrderList({ queryParams, page, size, refresh, updateQueryParameter });

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
                <CountOrderBtn label={'주문승인대기'} count={12} />
                <EventBtn
                  Icon={SimpleOrderIcon}
                  label={'간편주문승인'}
                  onClick={handleApproveAllSimpleOrderBtn}
                />
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
      </section>
    </div>
  );
};

export default ListComponent;
