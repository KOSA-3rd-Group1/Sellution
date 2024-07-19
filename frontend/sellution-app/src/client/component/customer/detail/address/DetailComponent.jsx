import FooterComponent from '@/client/layout/partials/FooterComponent';
import { InfoInput } from '@/client/layout/common/Input';
import { EventBtn } from '@/client/layout/common/Button';
import { useCustomerAddressDetail } from '@/client/business/customer/detail/address/useCustomerAddressDetail';

const DetailComponent = () => {
  const { data, handleChangeInputValue, moveList, handleSaveData, handleDeleteData } =
    useCustomerAddressDetail();

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] py-2 px-4 flex flex-col overflow-y-auto'>
        <div className='w-1/2'>
          <div className='w-full min-h-16 h-16 max-h-16 text-lg font-semibold flex items-center'>
            <div>배송지 상세 정보</div>
          </div>
          <ul className='w-full min-w-fit min-h-fit h-full flex flex-col text-sm border-t-2'>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>수령인</div>
              <div className='flex-1 min-w-64'>
                <InfoInput
                  value={data.name || ''}
                  onChange={(e) => handleChangeInputValue('name', e.target.value)}
                />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>우편번호</div>
              <div className='flex-1 min-w-64 flex gap-2'>
                <div className='flex-[2]'>
                  <InfoInput
                    value={data.zipcode || ''}
                    onChange={(e) => handleChangeInputValue('zipcode', e.target.value)}
                  />
                </div>
                <div className='flex-1 min-w-fit flex justify-end items-center'>
                  <EventBtn label={'우편번호 검색'} onClick={() => alert('테스트')} />
                </div>
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>주소</div>
              <div className='flex-1 min-w-64'>
                <InfoInput value={data.address || ''} readOnly />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>상세주소</div>
              <div className='flex-1 min-w-64'>
                <InfoInput value={data.addressDetail || ''} readOnly />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>휴대폰 번호</div>
              <div className='flex-1 min-w-64'>
                <InfoInput
                  value={data.phoneNumber || ''}
                  onChange={(e) => handleChangeInputValue('phoneNumber', e.target.value)}
                />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>배송지명</div>
              <div className='flex-1 min-w-64'>
                <InfoInput
                  value={data.addressName || ''}
                  onChange={(e) => handleChangeInputValue('addressName', e.target.value)}
                />
              </div>
            </li>
          </ul>
        </div>
      </section>
      <FooterComponent
        btn1={{ label: '배송지 삭제', event: handleDeleteData }}
        btn2={{ label: '변경사항 적용', event: handleSaveData }}
        back={{ label: '목록으로', event: moveList }}
      />
    </div>
  );
};

export default DetailComponent;
