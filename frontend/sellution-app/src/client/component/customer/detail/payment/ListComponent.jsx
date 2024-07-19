import FooterComponent from '@/client/layout/partials/FooterComponent';
import TablePayment from '@/client/layout/common/TablePayment';
import { EventBtn } from '@/client/layout/common/Button';
import { useCustomerPaymentList } from '@/client/business/customer/detail/payment/useCustomerPaymentList';

const ListComponent = () => {
  const { HEADERS, ROW_HEIGHT, data, totalDataCount, handleAddBtn, handleRowEvent, moveList } =
    useCustomerPaymentList();

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] py-2 px-4 flex flex-col overflow-y-auto '>
        <div className='w-full min-h-16 h-16 max-h-16 text-lg font-semibold flex items-center'>
          <div>결제 수단 목록</div>
        </div>
        <div className='h-3/5 overflow-hidden'>
          <TablePayment
            HEADERS={HEADERS}
            ROW_HEIGHT={ROW_HEIGHT}
            data={data}
            totalDataCount={totalDataCount}
            handleRowEvent={handleRowEvent}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn label={'결제 수단 등록'} onClick={handleAddBtn} />
              </div>
            }
          />
        </div>
      </section>
      <FooterComponent back={{ label: '목록으로', event: moveList }} />
    </div>
  );
};

export default ListComponent;
