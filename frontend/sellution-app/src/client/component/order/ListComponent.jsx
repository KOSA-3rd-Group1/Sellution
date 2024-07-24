import { EventBtn, NotBorderBtn, CountOrderBtn } from '@/client/layout/common/Button';
import Table from '@/client/layout/common/Table';
import Pagination from '@/client/layout/common/Pagination';
import DateRange from '@/client/layout/common/DateRange';
import ToggleButton from '@/client/layout/common/ToggleButton';
import { useOrderList } from '@/client/business/order/useOrderList';
import { SimpleOrderIcon } from '@/client/utility/assets/Icons';

const ListComponent = () => {
  const {
    HEADERS,
    ROW_HEIGHT,
    data,
    totalDataCount,
    tableState,
    dateRangeValue,
    isAutoOrderApproved,
    setTableState,
    handleChangeDateRangeValue,
    handleToggleAutoOrderApproved,
    handleApproveSimpleOrderBtn,
    handleRowEvent,
  } = useOrderList();

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
            <ToggleButton
              isToggled={isAutoOrderApproved}
              handleToggle={handleToggleAutoOrderApproved}
            />
          </div>
        </div>
        <div className='flex-grow overflow-hidden'>
          <Table
            HEADERS={HEADERS}
            ROW_HEIGHT={ROW_HEIGHT}
            data={data}
            totalDataCount={totalDataCount}
            tableState={tableState}
            setTableState={setTableState}
            handleRowEvent={handleRowEvent}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <CountOrderBtn label={'주문승인대기'} count={12} />
                <EventBtn
                  Icon={SimpleOrderIcon}
                  label={'간편주문승인'}
                  onClick={handleApproveSimpleOrderBtn}
                />
              </div>
            }
          />
        </div>
        <div className='h-12 flex-none flex justify-end items-end '>
          <Pagination totalDataCount={totalDataCount} />
        </div>
      </section>
    </div>
  );
};

export default ListComponent;
