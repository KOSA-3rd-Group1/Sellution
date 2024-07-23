import { EventBtn } from '@/client/layout/common/Button';
import TableEvent from '@/client/layout/common/table/TableEvent';
import Pagination from '@/client/layout/common/Pagination';
import DateRange from '@/client/layout/common/DateRange';
import { useEventList } from '@/client/business/event/useEventList';

const ListComponent = () => {
  const {
    HEADERS,
    ROW_HEIGHT,
    data,
    totalDataCount,
    dateRangeValue,
    handleChangeDateRangeValue,
    handleDeleteBtn,
    handleAddBtn,
    handleRowEvent,
  } = useEventList();

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-full flex flex-col'>
        <div className='relative text-lg flex-none mt-2 z-40'>
          <DateRange
            dateRangeValue={dateRangeValue}
            handleChangeDateRangeValue={handleChangeDateRangeValue}
          />
        </div>
        <div className='flex-grow overflow-hidden'>
          <TableEvent
            HEADERS={HEADERS}
            ROW_HEIGHT={ROW_HEIGHT}
            data={data}
            totalDataCount={totalDataCount}
            handleRowEvent={handleRowEvent}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn label={'이벤트 삭제'} onClick={handleDeleteBtn} />
                <EventBtn label={'이벤트 등록'} onClick={handleAddBtn} />
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
