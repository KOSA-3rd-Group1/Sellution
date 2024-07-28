import { ResetBtn } from '@/client/layout/common/Button';
import TablePaymentHistory from '@/client/layout/common/table/TablePaymentHistory';
import Pagination from '@/client/layout/common/Pagination';
import DateRange from '@/client/layout/common/DateRange';
import { useMove } from '@/client/business/common/useMove';
import { usePaymentHistoryList } from '@/client/business/paymentHistory/usePaymentHistoryList';
import { HEADERS, ROW_HEIGHT } from '@/client/utility/tableinfo/PaymentHistoryListTableInfo';

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
    totalDataCount,
    tableState,
    dateRangeValue,
    setTableState,
    handleChangeDateRangeValue,
    handleFilterReset,
  } = usePaymentHistoryList({ queryParams, page, size, refresh, updateQueryParameter });

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
          <TablePaymentHistory
            HEADERS={HEADERS}
            ROW_HEIGHT={ROW_HEIGHT}
            data={data}
            totalDataCount={totalDataCount}
            tableState={tableState}
            setTableState={setTableState}
            ResetBtn={<ResetBtn label={'초기화'} onClick={handleFilterReset} />}
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
