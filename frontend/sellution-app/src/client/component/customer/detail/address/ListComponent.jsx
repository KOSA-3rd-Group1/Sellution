import FooterComponent from '@/client/layout/partials/FooterComponent';
import TableAddress from '@/client/layout/common/table/TableAddress';
import { EventBtn } from '@/client/layout/common/Button';
import { useMove } from '@/client/business/common/useMove';
import { useCustomerAddressList } from '@/client/business/customer/detail/address/useCustomerAddressList';
import { HEADERS, ROW_HEIGHT } from '@/client/utility/tableinfo/CustomerAddressListTableInfo';

const ListComponent = () => {
  const { moveToPathname } = useMove();
  const { data, totalDataCount, defaultAddressObject } = useCustomerAddressList();

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] py-2 px-4 flex flex-col overflow-y-auto '>
        <div className='w-full min-h-16 h-16 max-h-16 text-lg font-semibold flex items-center'>
          <div>배송지 정보</div>
        </div>
        <div className='w-full'>
          <div className='relative mx-16 mt-2 mb-4 h-20 bg-[#F2F2F2] flex items-center px-10'>
            <div className='w-full truncate'>
              <span className='font-bold pr-4'>기본 배송지 |</span>
              <span>
                {defaultAddressObject
                  ? `[${defaultAddressObject.zipcode}] ${defaultAddressObject.address}`
                  : '기본 배송지로 설정된 주소가 없습니다.'}
              </span>
            </div>
          </div>
        </div>
        <div className='h-3/5 overflow-hidden'>
          <TableAddress
            HEADERS={HEADERS}
            ROW_HEIGHT={ROW_HEIGHT}
            data={data}
            totalDataCount={totalDataCount}
            handleRowEvent={moveToPathname}
            Btns={
              <div className='flex justify-center items-center gap-4'>
                <EventBtn label={'배송지 등록'} onClick={() => moveToPathname('add')} />
              </div>
            }
          />
        </div>
      </section>
      <FooterComponent back={{ label: '목록으로', event: () => moveToPathname('/customer') }} />
    </div>
  );
};

export default ListComponent;
