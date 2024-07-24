import { useCustomerList } from '@/client/business/customer/useCustomerList';
import { EventBtn } from '@/client/layout/common/Button';
import { AddCustomerIcon, BulkCustomerIcon, SendIcon } from '@/client/utility/assets/Icons';
import Table from '@/client/layout/common/Table';
import Pagination from '@/client/layout/common/Pagination';
import DateRange from '@/client/layout/common/DateRange';
import { useAuth } from '../../business/common/useAuth';
import { useMove } from '../../business/common/useMove';

const ListComponent = () => {
  const { AuthBaseInstance } = useAuth();
  const { page, size, refresh, moveToList, moveToDetailForCustomer, moveToAdd, moveToPagination } =
    useMove();
  const {
    HEADERS,
    ROW_HEIGHT,
    data,
    totalDataCount,
    tableState,
    dateRangeValue,
    totalPages,
    setTableState,
    handleChangeDateRangeValue,
    handleBulkCustomerManagementBtn,
    handleSendCouponBtn,
    // handleAddCustomerBtn,
    // handleRowEvent,
  } = useCustomerList({ AuthBaseInstance, page, size, refresh });
  console.log(page, size, totalPages);
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
          <Table
            HEADERS={HEADERS}
            ROW_HEIGHT={ROW_HEIGHT}
            data={data}
            totalDataCount={totalDataCount}
            tableState={tableState}
            setTableState={setTableState}
            handleRowEvent={moveToDetailForCustomer}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn
                  Icon={BulkCustomerIcon}
                  label={'대량 회원 관리'}
                  onClick={handleBulkCustomerManagementBtn}
                />
                <EventBtn Icon={SendIcon} label={'쿠폰 발송'} onClick={handleSendCouponBtn} />
                <EventBtn Icon={AddCustomerIcon} label={'회원 등록'} onClick={moveToAdd} />
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
