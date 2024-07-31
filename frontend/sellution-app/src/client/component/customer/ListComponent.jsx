import TableCustomer from '@/client/layout/common/table/TableCustomer';
import Pagination from '@/client/layout/common/Pagination';
import DateRange from '@/client/layout/common/DateRange';
import { EventBtn, ResetBtn } from '@/client/layout/common/Button';
import { useMove } from '@/client/business/common/useMove';
import { useCustomerList } from '@/client/business/customer/useCustomerList';
import { AddCustomerIcon } from '@/client/utility/assets/Icons';
import { HEADERS, ROW_HEIGHT } from '@/client/utility/tableinfo/CustomerListTableInfo';

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
    setTableState,
    handleChangeDateRangeValue,
    handleFilterReset,
  } = useCustomerList({ queryParams, page, size, refresh, updateQueryParameter });

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
          <TableCustomer
            HEADERS={HEADERS}
            ROW_HEIGHT={ROW_HEIGHT}
            data={data}
            totalDataCount={totalDataCount}
            tableState={tableState}
            setTableState={setTableState}
            handleRowEvent={moveToPathname}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                {/* <EventBtn
                  Icon={BulkCustomerIcon}
                  label={'대량 회원 관리'}
                  onClick={handleBulkCustomerManagementBtn}
                /> */}
                {/* <EventBtn Icon={SendIcon} label={'쿠폰 발송'} onClick={handleSendCouponBtn} /> */}
                <EventBtn
                  Icon={AddCustomerIcon}
                  label={'회원 등록'}
                  onClick={() => moveToPathname('add')}
                />
              </div>
            }
            ResetBtn={<ResetBtn label={'초기화'} onClick={handleFilterReset} />}
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
