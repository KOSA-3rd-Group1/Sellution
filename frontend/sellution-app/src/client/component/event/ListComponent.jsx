import { EventBtn } from '@/client/layout/common/Button';
import TableEvent from '@/client/layout/common/table/TableEvent';
import Pagination from '@/client/layout/common/Pagination';
import DateRange from '@/client/layout/common/DateRange';
import { useMove } from '@/client/business/common/useMove';
import { useEventList } from '@/client/business/event/useEventList';
import { HEADERS, ROW_HEIGHT } from '@/client/utility/tableinfo/EventListTableInfo';

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
    // HEADERS,
    // ROW_HEIGHT,
    data,
    totalPages,
    totalDataCount,
    dateRangeValue,
    handleChangeDateRangeValue,
    handleDeleteBtn,
    // handleAddBtn,
    // handleRowEvent,
  } = useEventList({ queryParams, page, size, refresh, updateQueryParameter });

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
            handleRowEvent={moveToPathname}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn label={'이벤트 삭제'} onClick={handleDeleteBtn} />
                <EventBtn label={'이벤트 등록'} onClick={() => moveToPathname('add')} />
              </div>
            }
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
