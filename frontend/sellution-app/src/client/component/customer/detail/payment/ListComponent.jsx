import { Link, useNavigate } from 'react-router-dom';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import Table from '@/client/layout/common/Table';
import { ListBtn } from '@/client/layout/common/Button';
import Pagination from '@/client/layout/common/Pagination';
import { useCustomerPaymentList } from '../../../../business/customer/detail/payment/useCustomerPaymentList';

const ListComponent = () => {
  //   const navigate = useNavigate();
  //   const moveList = () => {
  //     navigate({
  //       pathname: '/customer',
  //     });
  //   };

  const {
    HEADERS,
    ROW_HEIGHT,
    data,
    totalDataCount,
    tableState,
    setTableState,
    handleAddPaymentBtn,
    handleRowEvent,
    moveList,
  } = useCustomerPaymentList();

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto '>
        <div className='w-full h-20 text-lg font-semibold flex items-center'>
          <div>결제 수단 목록</div>
        </div>
        <div className='h-3/5 overflow-hidden'>
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
                <ListBtn content={'결제 수단 등록'} event={handleAddPaymentBtn} />
              </div>
            }
          />
        </div>
        <div className='h-12 flex-none flex justify-end items-end '>
          <Pagination totalDataCount={totalDataCount} />
        </div>
      </section>
      <FooterComponent back={{ label: '목록으로', event: moveList }} />
    </div>
  );
};

export default ListComponent;
