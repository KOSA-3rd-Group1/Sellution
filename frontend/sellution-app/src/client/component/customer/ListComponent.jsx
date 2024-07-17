import { useCustomerList } from '@/client/business/customer/useCustomerList';
import { ListBtn } from '@/client/layout/common/Button';
import { AddCustomerIcon, BulkCustomerIcon, SendIcon } from '@/client/utility/assets/Icons';
import Table from '@/client/layout/common/Table';
import Pagination from '@/client/layout/common/Pagination';
import DateRange from '@/client/layout/common/DateRange';

const ListComponent = () => {
  const {
    HEADERS,
    ROW_HEIGHT,
    data,
    totalDataCount,
    tableState,
    dateRangeValue,
    setTableState,
    handleChangeDateRangeValue,
    handleBulkCustomerManagementBtn,
    handleSendCouponBtn,
    handleAddCustomerBtn,
    handleRowEvent,
  } = useCustomerList();

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
            handleRowEvent={handleRowEvent}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <ListBtn
                  Icon={BulkCustomerIcon}
                  content={'대량 회원 관리'}
                  event={handleBulkCustomerManagementBtn}
                />
                <ListBtn Icon={SendIcon} content={'쿠폰 발송'} event={handleSendCouponBtn} />
                <ListBtn
                  Icon={AddCustomerIcon}
                  content={'회원 등록'}
                  event={handleAddCustomerBtn}
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
